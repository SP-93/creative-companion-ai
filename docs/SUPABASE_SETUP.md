# Supabase Setup Documentation

> Kompletna dokumentacija za OHL Oracle Supabase konfiguraciju

---

## Kredencijali

```
Project URL: https://bznqnuhljvtcvnjdmpbh.supabase.co
Anon Key: sb_publishable_LG9vXZLgpdv_b4pPgNHbAA_pmdhA8b2
Project Name: OverHippoLab-Oracle
Region: (check dashboard)
```

⚠️ **NAPOMENA:** Ovo je EKSTERNI Supabase projekat, NE Lovable Cloud!

---

## Tabele

### 1. profiles
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  has_basic_access BOOLEAN DEFAULT FALSE,
  dev_tier TEXT DEFAULT 'none',
  dev_expires_at TIMESTAMPTZ,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON public.profiles(wallet_address);
```

### 2. chat_messages
```sql
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  content TEXT NOT NULL,
  source_lang TEXT DEFAULT 'en',
  message_type TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_created ON public.chat_messages(created_at DESC);
```

### 3. message_translations
```sql
CREATE TABLE IF NOT EXISTS public.message_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  target_lang TEXT NOT NULL,
  translated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, target_lang)
);
```

### 4. payments
```sql
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  wallet_address TEXT NOT NULL,
  tx_hash TEXT UNIQUE NOT NULL,
  payment_type TEXT NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_over DECIMAL(18,8),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security (RLS)

Pokreni ovaj SQL u Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Anyone can read profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (true);

-- CHAT MESSAGES policies
CREATE POLICY "Anyone can read messages" 
  ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" 
  ON public.chat_messages FOR INSERT WITH CHECK (true);

-- MESSAGE TRANSLATIONS policies
CREATE POLICY "Anyone can read translations" 
  ON public.message_translations FOR SELECT USING (true);

CREATE POLICY "Service can insert translations" 
  ON public.message_translations FOR INSERT WITH CHECK (true);

-- PAYMENTS policies
CREATE POLICY "Anyone can read payments" 
  ON public.payments FOR SELECT USING (true);

CREATE POLICY "Anyone can insert payments" 
  ON public.payments FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update payments" 
  ON public.payments FOR UPDATE USING (true);
```

---

## Realtime

Omogući realtime za chat_messages:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
```

Ili ručno:
1. Idi na **Database → Replication**
2. Pronađi `chat_messages`
3. Uključi toggle

---

## Edge Functions (Planirano)

### translate-message
- **Svrha:** Prevodi chat poruke koristeći DeepL API
- **Endpoint:** `/functions/v1/translate-message`
- **Status:** Čeka deployment

### oracle-response
- **Svrha:** AI odgovori za Oracle mode
- **Endpoint:** `/functions/v1/oracle-response`
- **Status:** Planirano

---

## Troubleshooting

### "new row violates row-level security policy"
→ RLS policies nisu kreirane. Pokreni SQL iznad.

### Poruke se ne pojavljuju u realtime
→ Realtime nije omogućen za chat_messages. Pokreni ALTER PUBLICATION SQL.

### Profile se ne kreira
→ Provjeri da li je INSERT policy aktivan za profiles tabelu.
