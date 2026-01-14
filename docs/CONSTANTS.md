# O'HippoLab Constants Reference

> Sve konstante projekta na jednom mjestu

---

## Admin Configuration

```typescript
// Admin Wallet - Prima sve uplate
ADMIN_WALLET = '0x8334966329b7f4b459633696A8CA59118253bC89'
```

---

## Token Info

```typescript
TOKEN_INFO = {
  name: "O'HippoLab",
  symbol: 'OHL',
  decimals: 18,
  maxSupply: 250_000_000,
  network: 'OverProtocol',
  chainId: 54176,
}
```

---

## Pricing

### Basic Oracle Access
```typescript
BASIC_ORACLE_PRICE = $1.99 // Lifetime access
```

### DEV Mode Tiers
```typescript
DEV_TIERS = {
  shortrun: {
    price: $1.99,
    duration: 48 hours,
    label: '48h',
    description: 'Quick Trial'
  },
  standard: {
    price: $11.99,
    duration: 15 days,
    label: '15 Days',
    description: 'Best Value',
    badge: 'BEST VALUE'  // Highlighted tier
  },
  monthly: {
    price: $19.99,
    duration: 30 days,
    label: 'Monthly',
    description: 'Full Access'
  }
}
```

---

## OverProtocol Chain

```typescript
OVER_PROTOCOL = {
  chainId: 54176,
  chainIdHex: '0xD3A0',
  name: 'OverProtocol',
  rpcUrl: 'https://rpc.overprotocol.com',
  symbol: 'OVER',
  explorer: 'https://explorer.overprotocol.com'
}
```

---

## Supabase

```typescript
SUPABASE = {
  url: 'https://bznqnuhljvtcvnjdmpbh.supabase.co',
  anonKey: 'sb_publishable_LG9vXZLgpdv_b4pPgNHbAA_pmdhA8b2',
  project: 'OverHippoLab-Oracle'
}
```

---

## URLs

```typescript
URLS = {
  production: 'https://overhippolab-aioracle.vercel.app',
  supabaseDashboard: 'https://supabase.com/dashboard/project/bznqnuhljvtcvnjdmpbh',
  overExplorer: 'https://explorer.overprotocol.com',
  plannedDomain: 'https://ohippolab.com'
}
```

---

## Supported Languages

```typescript
LANGUAGES = ['en', 'sr', 'de', 'es', 'fr', 'pt', 'ru', 'zh', 'ja', 'ko']

LANGUAGE_NAMES = {
  en: 'English',
  sr: 'Srpski', 
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
}
```

---

## Database Tables

```typescript
TABLES = {
  profiles: 'public.profiles',
  chatMessages: 'public.chat_messages',
  messageTranslations: 'public.message_translations',
  payments: 'public.payments'
}
```

---

## Code References

Ove konstante su definisane u: `src/lib/constants.ts`

Supabase client: `src/lib/supabase.ts`

Database tipovi: `src/types/database.ts`
