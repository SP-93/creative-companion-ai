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

#### 14. Januar 2026
- ✅ **Frontend Setup:** Kompletiran osnovni UI sa Navbar, Hero, Features, Pricing, Footer
- ✅ **i18n Integracija:** 10 jezika (EN, SR, DE, ES, FR, PT, RU, ZH, JA, KO)
- ✅ **Supabase Client:** Konfigurisan sa environment variables fallback
- ✅ **Database Types:** Kreiran `src/types/database.ts` sa svim tipovima
- ✅ **Hooks:** `useSupabaseChat`, `useSupabaseProfile` implementirani
- ✅ **WalletContext:** Integracija sa OverProtocol, profil loading iz Supabase
- ✅ **Vercel Deployment:** Uspješno deployano na `overhippolab-aioracle.vercel.app`
- ⏳ **Environment Variables:** U toku - dodavanje na Vercel
- ⏳ **RLS Policies:** Čeka se verifikacija u Supabase

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
