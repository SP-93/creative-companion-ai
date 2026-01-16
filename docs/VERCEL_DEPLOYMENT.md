# Vercel Deployment Documentation

> Instrukcije za deployment i konfiguraciju na Vercel

---

## Trenutni Deployment

```
URL: https://overhippolab-aioracle.vercel.app
Branch: main
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

---

## Environment Variables

### Obavezne varijable

| Key | Value | Opis |
|-----|-------|------|
| `VITE_SUPABASE_URL` | `https://bznqnuhljvtcvnjdmpbh.supabase.co` | Supabase projekt URL |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_LG9vXZLgpdv_b4pPgNHbAA_pmdhA8b2` | Supabase anon key |

### Kako dodati Environment Variables

1. Idi na **vercel.com** → Tvoj projekat
2. Klikni **Settings** (u gornjem meniju)
3. U lijevom meniju klikni **Environment Variables**
4. Za svaku varijablu:
   - **Key:** Ime varijable (npr. `VITE_SUPABASE_URL`)
   - **Value:** Vrijednost (npr. `https://bznqnuhljvtcvnjdmpbh.supabase.co`)
   - **Environments:** Označi sve tri opcije (Production, Preview, Development)
5. Klikni **Save**
6. Idi na **Deployments** → Klikni tri tačke na zadnjem deploymentu → **Redeploy**

⚠️ **VAŽNO:** Key polje je LIJEVO (ime varijable), Value polje je DESNO (vrijednost)!

---

## Build Settings

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## Custom Domain (Planirano)

Kada budemo spremni za custom domain:

1. Idi na **Settings → Domains**
2. Dodaj domain: `ohippolab.com` ili `oracle.ohippolab.com`
3. Ažuriraj DNS zapise kod domain provider-a:
   - **A Record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`

---

## GitHub Sync (VAŽNO!)

**Lovable promjene NE idu automatski na Vercel!**

Moraš ručno sync-ovati sa GitHub-om:

1. U Lovable klikni **GitHub ikonu** (gore desno)
2. Klikni **Push to GitHub** ili **Sync**
3. Vercel će automatski pokrenuti novi deploy nakon push-a
4. Čekaj 1-2 minute za build

---

## Redeploy Checklist

Kada radiš promjene:

- [ ] Sync Lovable → GitHub (obavezno!)
- [ ] Provjeri da su Environment Variables postavljene
- [ ] Provjeri da je correct branch (main)
- [ ] Čekaj da Vercel završi deploy

---

## Troubleshooting

### Build fails
→ Provjeri console output u Vercel Deployments za error

### Supabase ne radi na production
→ Provjeri da su VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY postavljeni

### Stara verzija se prikazuje
→ Sync Lovable → GitHub, pa čekaj Vercel deploy
→ Hard refresh (Ctrl+Shift+R) ili očisti cache

### Profile kreiranje ne radi (FOREIGN KEY ERROR)

**Error poruka:**
```
ERROR: 23503: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL: Key (id)=(...) is not present in table "users"
```

**Uzrok:** Tabela `profiles` ima foreign key koji referencira `auth.users`, ali OHL koristi wallet-based auth (nema Supabase users).

**Rešenje - Pokreni u Supabase SQL Editor:**
```sql
-- KORAK 1: Ukloni foreign key constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- KORAK 2: Dodaj default UUID generator
ALTER TABLE public.profiles 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- KORAK 3 (opciono): Proveri da li je uspešno
SELECT column_name, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'id';
```

### Admin wallet nema pristup
Admin wallet (`0x8334966329b7f4b459633696A8CA59118253bC89`) sada automatski dobija pun pristup bez obzira na database. Ovo je hardcoded u frontend kodu za bezbednost.

---

## Full Documentation

Za detaljnije troubleshooting, pogledaj: `docs/TROUBLESHOOTING.md`
