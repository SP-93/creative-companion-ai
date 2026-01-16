# O'HippoLab Development Log

> Hronološka evidencija razvoja OHL Oracle platforme

---

## Projekat Info

- **Naziv:** O'HippoLab (OHL) Oracle
- **Stack:** React + Vite + TypeScript + Tailwind CSS + Supabase
- **Deployment:** Vercel
- **Blockchain:** OverProtocol (Chain ID: 54176)

---

## Development Timeline

### Januar 2026

#### 16. Januar 2026 (Update 2)
- ✅ **Chat Separation:** Razdvojeni World Chat i Oracle AI u odvojene chat sobe
- ✅ **Supabase Migration:** Dodata `chat_room` kolona (world/oracle) u `chat_messages`
- ✅ **New Hooks Created:**
  - `useWorldChat.ts` - Public chat (chat_room = 'world')
  - `useOracleChat.ts` - Private per-user AI chat (chat_room = 'oracle')
- ✅ **Oracle AI Integration:** Povezan sa Edge Function, AI loading state
- ✅ **Navbar Cleanup:** Uklonjen dupli ADMIN badge
- ✅ **CSS Fix:** @import premešten na početak za Vercel build
- ✅ **Edge Function Updated:** `oracle-response` koristi chat_room = 'oracle'

#### 16. Januar 2026
- ✅ **Database Complete:** Kreirana `token_rewards` tabela
- ✅ **RLS Policies:** Verifikovane i dodate na sve tabele (profiles, chat_messages, message_translations, payments, token_rewards)
- ✅ **Edge Functions Deployed:**
  - `verify-payment` - Blockchain verifikacija transakcija
  - `admin-actions` - Admin operacije (aktivacija, revokacija, statistika)
  - `oracle-response` - AI odgovori za DEV korisnike
- ✅ **Supabase Secrets:** Konfigurisani OVER_RPC_URL i OPENAI_API_KEY
- ✅ **WalletConnect Integracija:**
  - Project ID: `8617065cc8bc205011c57eddae9d6203`
  - Kreiran `src/lib/walletconnect.ts`
  - Kreiran `src/components/WalletModal.tsx`
  - Ažuriran WalletContext sa podrškom za WalletConnect
- ✅ **Dokumentacija:** Kreiran PROJECT_STATUS.md, ažurirani svi docs

#### 14. Januar 2026
- ✅ **Frontend Setup:** Kompletiran osnovni UI sa Navbar, Hero, Features, Pricing, Footer
- ✅ **i18n Integracija:** 10 jezika (EN, SR, DE, ES, FR, PT, RU, ZH, JA, KO)
- ✅ **Supabase Client:** Konfigurisan sa environment variables fallback
- ✅ **Database Types:** Kreiran `src/types/database.ts` sa svim tipovima
- ✅ **Hooks:** `useSupabaseChat`, `useSupabaseProfile` implementirani
- ✅ **WalletContext:** Integracija sa OverProtocol, profil loading iz Supabase
- ✅ **Vercel Deployment:** Uspješno deployano na `overhippolab-aioracle.vercel.app`
- ✅ **Environment Variables:** Konfigurisano na Vercel
- ✅ **RLS Policies:** Verifikovano u Supabase

---

## Važne Odluke

### Backend Arhitektura
- **Odluka:** Koristimo EKSTERNI Supabase (bznqnuhljvtcvnjdmpbh), NE Lovable Cloud
- **Razlog:** Veća kontrola, postojeći setup, custom konfiguracija

### Autentifikacija
- **Odluka:** Wallet-based auth (MetaMask/OverProtocol), NE Supabase Auth
- **Razlog:** Web3 native pristup, korisnici se identifikuju wallet adresom

### Pricing Model
- **Basic Oracle:** $1.99 (lifetime)
- **DEV Mode Tiers:**
  - ShortRun: $1.99 (48h)
  - Standard: $11.99 (15 dana) - BEST VALUE
  - Monthly: $19.99 (30 dana)

---

## Planirane Funkcionalnosti

1. **Admin Panel** - Wallet verifikacija, user management, statistika
2. **Payment Flow** - OVER token transakcije, automatski subscription update
3. **Edge Functions** - Translation API, Oracle responses
4. **OHL Token Deploy** - Token deployment stranica

---

## Reference

- Supabase Dashboard: https://supabase.com/dashboard/project/bznqnuhljvtcvnjdmpbh
- Vercel Dashboard: https://vercel.com/dashboard
- OverProtocol Explorer: https://explorer.overprotocol.com
