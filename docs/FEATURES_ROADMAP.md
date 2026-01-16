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

## ✅ Nedavno Završeno

### Production Setup (16. Jan 2026)
- [x] Vercel Environment Variables
- [x] Supabase RLS Policies (sve tabele)
- [x] Supabase Realtime za chat
- [x] Edge Functions deployed
- [x] WalletConnect integracija

### Backend Complete
- [x] token_rewards tabela
- [x] verify-payment Edge Function
- [x] admin-actions Edge Function
- [x] oracle-response Edge Function
- [x] Supabase Secrets konfigurisani

---

## ⏳ U Toku

### Testing Phase
- [ ] Wallet connect testiranje (MetaMask + WalletConnect)
- [ ] Payment flow testiranje
- [ ] Oracle AI testiranje
- [ ] Production deployment

---

## 📋 Planirano

### Phase 1: Core Functionality ✅ ZAVRŠENO

#### Chat System
- [x] Chat UI komponenta
- [x] Real-time poruke
- [x] Oracle mode (AI odgovori)
- [ ] Message translation (opciono)

#### Payment Flow
- [x] Payment modal
- [x] Transaction verification (Edge Function)
- [x] Automatic subscription activation
- [ ] OVER token price feed (opciono)

### Phase 2: Admin & Management ✅ ZAVRŠENO

#### Admin Panel (/admin)
- [x] Admin wallet verifikacija
- [x] User lista sa pretplatama
- [x] Payment history
- [x] Platform statistika
- [x] Manual subscription management

### Phase 3: Advanced Features ✅ ZAVRŠENO

#### Edge Functions
- [x] oracle-response (AI backend)
- [x] verify-payment (blockchain verification)
- [x] admin-actions (admin operacije)
- [ ] translate-message (DeepL API) - opciono

#### Token Integration
- [x] OHL Token deploy stranica
- [x] Token info prikaz
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
