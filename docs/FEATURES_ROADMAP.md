# O'HippoLab Features Roadmap

> Pregled svih funkcionalnosti - završenih, u toku, i planiranih

---

## ✅ Završeno

### Frontend Core
- [x] Navbar sa wallet connect button
- [x] Hero sekcija sa OHL branding
- [x] Features sekcija (6 kartica)
- [x] Pricing sekcija (Basic Oracle + 3 DEV tiers)
- [x] Footer sa linkovima
- [x] Responsive dizajn (mobile/desktop)
- [x] Dark theme

### Internacionalizacija (i18n)
- [x] 10 jezika implementirano
- [x] Language selector dropdown
- [x] Automatska detekcija browser jezika
- [x] Svi UI elementi prevedeni

**Podržani jezici:**
| Kod | Jezik |
|-----|-------|
| en | English |
| sr | Srpski |
| de | Deutsch |
| es | Español |
| fr | Français |
| pt | Português |
| ru | Русский |
| zh | 中文 |
| ja | 日本語 |
| ko | 한국어 |

### Wallet Integration
- [x] MetaMask connect
- [x] OverProtocol network switch
- [x] Balance prikaz
- [x] Wallet disconnect
- [x] WalletContext provider

### Supabase Integration
- [x] Supabase client konfiguracija
- [x] Environment variables sa fallback
- [x] TypeScript tipovi za bazu
- [x] useSupabaseProfile hook
- [x] useSupabaseChat hook

### Database (Supabase)
- [x] profiles tabela
- [x] chat_messages tabela
- [x] message_translations tabela
- [x] payments tabela

---

## ⏳ U Toku

### Production Setup
- [ ] Vercel Environment Variables
- [ ] Supabase RLS Policies
- [ ] Supabase Realtime za chat
- [ ] Production testing

---

## 📋 Planirano

### Phase 1: Core Functionality

#### Chat System
- [ ] Chat UI komponenta
- [ ] Real-time poruke
- [ ] Oracle mode (AI odgovori)
- [ ] Message translation

#### Payment Flow
- [ ] OVER token price feed
- [ ] Payment modal
- [ ] Transaction verification
- [ ] Automatic subscription activation

### Phase 2: Admin & Management

#### Admin Panel (/admin)
- [ ] Admin wallet verifikacija
- [ ] User lista sa pretplatama
- [ ] Payment history
- [ ] Platform statistika
- [ ] Manual subscription management

### Phase 3: Advanced Features

#### Edge Functions
- [ ] translate-message (DeepL API)
- [ ] oracle-response (AI backend)
- [ ] verify-payment (blockchain verification)

#### Token Integration
- [ ] OHL Token deploy stranica
- [ ] Token info prikaz
- [ ] Staking (future)

### Phase 4: Polish

#### UX Improvements
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Onboarding flow

#### SEO & Marketing
- [ ] OG Image kreiranje
- [ ] Meta tags optimizacija
- [ ] Landing page A/B testing

---

## Prioriteti

| Prioritet | Feature | Effort |
|-----------|---------|--------|
| 🔴 HIGH | Vercel Env Variables | 5 min |
| 🔴 HIGH | RLS Policies | 5 min |
| 🟡 MEDIUM | Chat UI | 2-3h |
| 🟡 MEDIUM | Payment Flow | 3-4h |
| 🟢 LOW | Admin Panel | 4-5h |
| 🟢 LOW | Edge Functions | 2-3h |

---

## Notes

- Koristimo EKSTERNI Supabase, ne Lovable Cloud
- Wallet-based auth umjesto Supabase Auth
- Sve cijene u USD, plaćanje u OVER tokenu
