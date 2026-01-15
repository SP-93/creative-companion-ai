# O'HippoLab Edge Functions

> Dokumentacija za Supabase Edge Functions

---

## Pregled

| Function | Endpoint | Opis |
|----------|----------|------|
| verify-payment | `/functions/v1/verify-payment` | Verifikacija blockchain transakcija |
| admin-actions | `/functions/v1/admin-actions` | Admin operacije (zaštićeno) |
| oracle-response | `/functions/v1/oracle-response` | AI Oracle odgovori |

---

## verify-payment

Verifikuje OVER token plaćanja na blockchainu i aktivira subscription.

### Request

```typescript
POST /functions/v1/verify-payment
Content-Type: application/json

{
  "tx_hash": "0x...",
  "wallet_address": "0x...",
  "payment_type": "basic" | "shortrun" | "standard" | "monthly",
  "amount_over": 1.99
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "payment_id": "uuid",
  "payment_type": "basic",
  "expires_at": null,
  "message": "Basic Oracle activated successfully!"
}
```

**Errors:**
- 400: Missing fields, invalid transaction
- 404: Transaction not found
- 409: Payment already processed
- 500: Server error

### Flow

1. Prima tx_hash od frontenda
2. Provjerava transakciju na OverProtocol RPC
3. Validira: recipient = ADMIN_WALLET, sender = wallet_address
4. Čeka confirmation (receipt.status === 0x1)
5. Zapisuje payment u `payments` tabelu
6. Ažurira `profiles` tabelu (has_basic_access ili dev_tier)

---

## admin-actions

Omogućava admin operacije - samo za ADMIN_WALLET.

### Actions

#### activate_basic
```json
{
  "action": "activate_basic",
  "admin_wallet": "0x...",
  "target_wallet": "0x..."
}
```

#### activate_dev
```json
{
  "action": "activate_dev",
  "admin_wallet": "0x...",
  "target_wallet": "0x...",
  "dev_tier": "shortrun" | "standard" | "monthly"
}
```

#### revoke_access
```json
{
  "action": "revoke_access",
  "admin_wallet": "0x...",
  "target_wallet": "0x..."
}
```

#### extend_subscription
```json
{
  "action": "extend_subscription",
  "admin_wallet": "0x...",
  "target_wallet": "0x...",
  "days": 7
}
```

#### get_stats
```json
{
  "action": "get_stats",
  "admin_wallet": "0x..."
}
```

Response:
```json
{
  "success": true,
  "stats": {
    "total_users": 100,
    "basic_users": 50,
    "dev_users": 25,
    "total_payments": 75,
    "total_revenue": 500.00
  }
}
```

---

## oracle-response

AI-powered Oracle odgovori za DEV tier korisnike.

### Request

```json
{
  "wallet_address": "0x...",
  "message": "What is the current state of DeFi?",
  "language": "en"
}
```

### Response

```json
{
  "success": true,
  "response": "DeFi (Decentralized Finance) continues to evolve...",
  "tokens_used": 150
}
```

### Requirements

- Korisnik mora imati aktivan DEV tier
- OPENAI_API_KEY mora biti konfigurisan

---

## Secrets (Environment Variables)

Dodaj u Supabase Dashboard → Project Settings → Edge Functions → Secrets:

| Secret | Potrebno Za | Vrijednost |
|--------|-------------|------------|
| OVER_RPC_URL | verify-payment | `https://rpc.overprotocol.com` |
| OPENAI_API_KEY | oracle-response | `sk-...` |

**Automatski dostupni:**
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

---

## Deployment

Edge funkcije se automatski deployaju sa Lovable preview buildom.

Za manual deploy (Supabase CLI):
```bash
supabase functions deploy verify-payment
supabase functions deploy admin-actions
supabase functions deploy oracle-response
```

---

## Testing

### Test verify-payment

```bash
curl -X POST https://bznqnuhljvtcvnjdmpbh.supabase.co/functions/v1/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "0x...",
    "wallet_address": "0x...",
    "payment_type": "basic",
    "amount_over": 1.99
  }'
```

### Test admin-actions

```bash
curl -X POST https://bznqnuhljvtcvnjdmpbh.supabase.co/functions/v1/admin-actions \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_stats",
    "admin_wallet": "0x8334966329b7f4b459633696A8CA59118253bC89"
  }'
```

---

## Logs

Pregledaj logove u Supabase Dashboard → Edge Functions → Logs

Svaka funkcija loguje:
- Request info (wallet, action)
- Processing steps
- Errors sa detaljima
