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

Production secrets are set in the Cloudflare dashboard after creating the Workers project (see **section 8.2**). You'll need:

- `ADMIN_SECRET` — a strong random secret (min 32 chars)
- `R2_ACCOUNT_ID` — your Cloudflare Account ID (for presigned uploads, optional)
- `R2_ACCESS_KEY_ID` — R2 API token Access Key ID (for presigned uploads, optional)
- `R2_SECRET_ACCESS_KEY` — R2 API token Secret Access Key (for presigned uploads, optional)

Generate a strong `ADMIN_SECRET` now:

```bash
node -e "console.log(require('crypto').randomBytes(36).toString('hex'))"
```

> **Tip:** For R2 presigned URL credentials, create an R2 API token at [Cloudflare R2 → Manage R2 API Tokens](https://dash.cloudflare.com/r2/api-tokens) with **Object Read & Write** for the `emmal` bucket.

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

### 8.1 — Create the Workers Project via Dashboard

1. Go to [Workers & Pages](https://dash.cloudflare.com/workers-and-pages).
2. Click **"Create"** → **"Import a repository"**.
3. Connect your GitHub account (authorize Cloudflare to access your repos).
4. Select the `emmal` repository.
5. Under **"Set up builds and deployments"**:
   - **Framework preset:** None
   - **Build command:** `npm run cf:build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
6. Click **"Save and Deploy"**.

Cloudflare will clone the repo, run the build, and deploy the Worker automatically. Every push to `main` will trigger a new deployment.

### 8.2 — Add Environment Variables in the Dashboard

After the initial deploy, add secrets/variables in the dashboard:

1. Go to **Workers & Pages → emmal → Settings → Variables and Secrets**.
2. Add the following:

| Variable | Type | Value |
|---|---|---|
| `ADMIN_SECRET` | Secret | Your strong random secret (min 32 chars) |
| `R2_ACCOUNT_ID` | Secret | Your Cloudflare Account ID (for presigned uploads) |
| `R2_ACCESS_KEY_ID` | Secret | R2 API token Access Key ID (for presigned uploads) |
| `R2_SECRET_ACCESS_KEY` | Secret | R2 API token Secret Access Key (for presigned uploads) |

3. Click **"Deploy"** to trigger a new deployment with the new variables.

### 8.3 — GitHub Actions CI/CD (optional)

If you prefer GitHub Actions instead of the dashboard's built-in CI:

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

## 9. Add a Custom Domain

By default your Worker is accessible at `https://emmal.<your-subdomain>.workers.dev`. To use your own domain (e.g. `emmal.example.com`):

### 9.1 — Add the domain to Cloudflare

1. Go to [Cloudflare Dashboard → Add a Site](https://dash.cloudflare.com/?to=/:account/add-site).
2. Enter your domain name and click **Continue**.
3. Select a plan (Free is fine).
4. Cloudflare will scan your existing DNS records. Review and continue.
5. Cloudflare will give you **two nameservers**. Go to your domain registrar (where you bought the domain) and update the nameservers to the ones Cloudflare provided.
6. Wait for DNS propagation (can take a few minutes to 24 hours). Cloudflare will email you when the domain is active.

### 9.2 — Bind the custom domain to your Worker

1. Go to **Workers & Pages → emmal → Settings → Domains & Routes**.
2. Click **"Add"** → **"Custom domain"**.
3. Enter your domain (e.g. `emmal.example.com` or `example.com`).
4. Click **"Add domain"**.

Cloudflare will:
- Automatically create a DNS record pointing to the Worker.
- Provision an SSL/TLS certificate automatically.
- Route traffic from that domain to your Worker.

### 9.3 — Verify the custom domain

Wait a minute or two, then visit your domain in the browser. You should see your app live with a valid SSL certificate.

You can also verify in the dashboard under **Workers & Pages → emmal → Settings → Domains & Routes** — the status should show **Active**.

> **Note:** If you're using a subdomain (e.g. `app.example.com`), make sure the root domain is already added to Cloudflare. The subdomain DNS record is created automatically when you bind it.

---

## 10. Preview Locally

To test the app on the Cloudflare Workers runtime locally before deploying:

```bash
npm run preview
```

This builds and runs the app locally with your local D1 and R2 bindings.

---

## 11. Verify & Troubleshoot

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
npm run migrate:prod                      # 5. Run migrations on remote
# 6. Push to GitHub, then import repo in Cloudflare dashboard
# 7. Add env vars/secrets in the dashboard
# 8. Add custom domain in Workers → Settings → Domains & Routes
```
