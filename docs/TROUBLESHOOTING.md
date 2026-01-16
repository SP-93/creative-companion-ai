# OHL Oracle - Troubleshooting Guide

## 🔴 CRITICAL: Supabase Foreign Key Error

### Error Message
```
ERROR: 23503: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL: Key (id)=(e193e293-eee7-41e2-a723-e0ab5673f516) is not present in table "users"
```

### Cause
Tabela `profiles` ima **foreign key** koji referencira `auth.users.id`, ali OHL Oracle koristi **wallet-based authentication** (nema Supabase auth.users).

### Solution (Run in Supabase SQL Editor)

```sql
-- STEP 1: Remove the foreign key constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- STEP 2: Set default UUID generator for id column
ALTER TABLE public.profiles 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- STEP 3: Verify the change
SELECT 
  column_name, 
  column_default, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'id';

-- STEP 4 (OPTIONAL): Insert admin profile
INSERT INTO public.profiles (wallet_address, username, has_basic_access, dev_tier, dev_expires_at)
VALUES (
  '0x8334966329b7f4b459633696a8ca59118253bc89',  -- Admin wallet (lowercase!)
  'Admin',
  true,
  'monthly',
  NULL  -- NULL = never expires
)
ON CONFLICT (wallet_address) 
DO UPDATE SET 
  has_basic_access = true,
  dev_tier = 'monthly',
  dev_expires_at = NULL;
```

---

## 🟡 Wallet Not Reconnecting After Refresh

### Symptoms
- User connects wallet successfully
- After page refresh, wallet is disconnected
- Must reconnect every time

### Cause
MetaMask needs time to initialize after page load. The app was trying to reconnect too fast.

### Solution (Already Fixed in Code)
- Added 500ms delay before auto-reconnect attempt
- Using `eth_accounts` instead of `eth_requestAccounts` (no popup)
- Better error handling with cleanup

---

## 🟡 Admin Wallet Not Getting Full Access

### Symptoms
- Admin wallet connects but doesn't have full access
- "Basic" or "Dev" badges not showing

### Cause
Database profile doesn't exist or has wrong permissions.

### Solution
1. **Frontend Fix (Already Implemented)**: Admin wallet (`0x8334966329b7f4b459633696A8CA59118253bC89`) now gets automatic full access regardless of database.

2. **Database Fix (Optional)**:
```sql
-- Update admin profile with full access
UPDATE public.profiles
SET 
  has_basic_access = true,
  dev_tier = 'monthly',
  dev_expires_at = NULL
WHERE wallet_address = '0x8334966329b7f4b459633696a8ca59118253bc89';
```

---

## 🟡 Mock Data Showing on Landing Page

### Status
**Fixed** - Numbers are now clearly labeled as "Goal", "Projected", "Target"

This is standard practice for landing pages - showing business objectives rather than real-time data.

---

## 🟡 Vercel Showing Old Version

### Cause
Lovable and GitHub are not automatically synced. You need to manually push changes.

### Solution
1. In Lovable, click the **GitHub icon** (top right)
2. Click **"Push to GitHub"** or **"Sync"**
3. Wait for green checkmark
4. Go to Vercel → Deployments → verify new build started
5. Hard refresh browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

---

## 🟢 Common Supabase Errors

### Error: 406 (Not Acceptable)
**Cause**: Usually RLS policy blocking the request.
**Solution**: Check RLS policies allow wallet-based queries.

### Error: 409 (Conflict) 
**Cause**: Duplicate entry for unique field (wallet_address).
**Solution**: Already handled in code with `ON CONFLICT` logic.

### Error: 23502 (Not Null Violation)
**Cause**: Required field is NULL (usually `id`).
**Solution**: Run the foreign key fix SQL above.

---

## 📞 Need Help?

1. Check Supabase Dashboard → Logs for detailed errors
2. Check browser Console (F12) for frontend errors
3. Check Network tab for API response details
