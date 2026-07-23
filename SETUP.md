# Emmal — Full Cloudflare Setup Guide

This guide walks you through deploying Emmal from scratch on Cloudflare.

---

## 1. Create a Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. Enter your email and a strong password.
3. Verify your email via the confirmation link.
4. Note your **Account ID** from the dashboard URL: `https://dash.cloudflare.com/<account-id>/workers`.

---

## 2. Upload the Code to GitHub

```bash
# From the project root
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/emmal.git
git push -u origin main
```

> The `.gitignore` already excludes `.env*`, `.dev.vars*`, `.wrangler/`, `.open-next/`, and `node_modules/`.

---

## 3. Install Wrangler & Log In

```bash
# Wrangler is already in devDependencies, but you can install globally too:
npm install -g wrangler

# Log in to Cloudflare
npx wrangler login
```

This opens a browser — click **"Allow"** to authorize.

> **Headless alternative:** Set `CLOUDFLARE_API_TOKEN` env var instead. Create a token at [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template.

---

## 4. Create Cloudflare Resources (D1 & R2)

### 4.1 — Create a D1 Database

```bash
npx wrangler d1 create emmal
```

Output will include a `database_id` — **copy it**, you'll need it next.

### 4.2 — Create an R2 Bucket

```bash
npx wrangler r2 bucket create emmal
```

R2 buckets are referenced by name only (no ID needed).

---

## 5. Update `wrangler.jsonc` with Your IDs

Open `wrangler.jsonc` and update:

### D1 — Replace the `database_id`

```jsonc
"d1_databases": [
    {
        "database_name": "emmal",
        "binding": "DB",
        "database_id": "YOUR-DATABASE-ID-HERE",  // ← from step 4.1
        "migrations_dir": "db/migrations"
    }
],
```

### R2 — Verify the bucket name

```jsonc
"r2_buckets": [
    {
        "bucket_name": "emmal",  // ← must match step 4.2
        "binding": "MEDIA"
    }
],
```

### Worker name (optional)

If you change the `"name"` field, also update `"service"` in the `services` section to match.

---

## 6. Set Environment Variables & Secrets

### 6.1 — Local development (`.dev.vars`)

Create/edit `.dev.vars` (gitignored):

```
NEXTJS_ENV=development
ADMIN_SECRET=generate-a-strong-random-secret-at-least-32-chars
```

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(36).toString('hex'))"
```

### 6.2 — Remote (production) secrets

```bash
npx wrangler secret put ADMIN_SECRET
```

Paste your secret when prompted.

> **Tip:** For production, prefer `wrangler secret put` over keeping `ADMIN_SECRET` in `wrangler.jsonc` `vars` — secrets are encrypted and not visible in the dashboard.

### 6.3 — R2 presigned URL credentials (optional)

For direct browser-to-R2 uploads via presigned URLs:

1. Go to [Cloudflare R2 → Manage R2 API Tokens](https://dash.cloudflare.com/r2/api-tokens).
2. Create a token with **Object Read & Write** for the `emmal` bucket.
3. Set them as secrets:

```bash
npx wrangler secret put R2_ACCOUNT_ID
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
```

---

## 7. Run Database Migrations on Remote

The migration files are in `db/migrations/` (12 migrations, 0001–0012).

### Apply migrations to the remote D1 database

```bash
npm run migrate:prod
```

This runs `npx wrangler d1 migrations apply emmal --remote`.

### Verify

```bash
npx wrangler d1 migrations list emmal --remote
npx wrangler d1 execute emmal --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

### Local migrations (for development)

```bash
npm run migrate:local
```

---

## 8. Create a Workers Project & Connect to GitHub

### Option A — CLI Deploy (recommended)

The `wrangler.jsonc` already defines the Worker. Simply deploy:

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`.

### Option B — Cloudflare Dashboard (GitHub integration)

1. Go to [Workers & Pages](https://dash.cloudflare.com/workers-and-pages).
2. Click **"Create"** → **"Import a repository"**.
3. Connect your GitHub account.
4. Select the `emmal` repository.
5. Set **Build command:** `npm run cf:build`
6. Add environment variables under **Settings → Variables** (`ADMIN_SECRET`, R2 keys if needed).
7. Click **"Save and Deploy"**.

### Option C — GitHub Actions CI/CD (optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run migrate:prod
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Set `CLOUDFLARE_API_TOKEN` in GitHub repo **Settings → Secrets → Actions**.

---

## 9. Deploy

```bash
npm run deploy
```

Output includes your Worker URL:

```
Published emmal (x.xx sec)
  https://emmal.<your-subdomain>.workers.dev
```

### Preview locally on the Cloudflare runtime

```bash
npm run preview
```

---

## 10. Verify & Troubleshoot

```bash
# Real-time logs
npx wrangler tail

# Check D1 tables
npx wrangler d1 execute emmal --remote --command "SELECT name FROM sqlite_master WHERE type='table'"

# List R2 objects
npx wrangler r2 object list emmal

# List secrets
npx wrangler secret list
```

### Common Issues

| Issue | Fix |
|---|---|
| `Database not found` | Verify `database_id` in `wrangler.jsonc` |
| `Bucket not found` | Verify `bucket_name` matches your R2 bucket |
| `Unauthorized` on admin API | Ensure `ADMIN_SECRET` is set as a secret |
| Presigned uploads return 503 | Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` |
| Build memory error | Run with `NODE_OPTIONS=--max-old-space-size=8192` |

---

## Quick Start Summary

```bash
npx wrangler login                        # 1. Log in
npx wrangler d1 create emmal              # 2. Create D1 (copy the ID!)
npx wrangler r2 bucket create emmal       # 3. Create R2
# 4. Update wrangler.jsonc with your database_id
npx wrangler secret put ADMIN_SECRET      # 5. Set secret
npm run migrate:prod                      # 6. Run migrations
npm run deploy                            # 7. Deploy!
```
