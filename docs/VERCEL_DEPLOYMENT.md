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

### Profile kreiranje ne radi
→ U Supabase SQL Editor pokreni:
```sql
ALTER TABLE public.profiles 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
```
