# Welcome page

The homepage now checks the singleton welcome-page settings before displaying normal site content. It shows the branded welcome view when enabled. Entering the website dismisses it for the current tab session (shared between Arabic and English); article, edition, booking and admin deep links are unaffected. If the settings service fails or times out, the homepage remains accessible.

- Editor: `/admin/welcome-page`
- Always-visible saved previews: `/ar/welcome` and `/en/welcome` (noindex)
- Public read / authenticated admin write: `/api/welcome-page`
- Migration: `db/migrations/0029_welcome_page.sql` (new installations default to disabled)
- Editable bilingual titles, descriptions, dates, image caption, button labels, image, registration URLs and summit-details URLs.
- Two independent agenda downloads, each with bilingual labels, descriptions and optional Arabic/English PDFs. Each day's available file is reused for the other language. Clear both second-day URLs to hide that button. A missing first agenda or registration link appears disabled with a coming-soon caption.
- Existing single-agenda configurations remain compatible; new fields default to an empty second download without a database migration.
- No emails, registration submissions, payment calls or third-party form embedding are performed by this feature.

## Local state, 2026-11-21

The initial preview was enabled in local D1 with the IBS III Baghdad–Davos content and existing summit image. Agenda PDFs and registration URLs are empty as requested. No production changes were made during that preview. The owner subsequently authorized publishing and enabling it on 2026-11-21, leaving the PDF and registration URLs empty.

A local database backup was taken at `.wrangler/backups/local-before-welcome-20261121.sql`. The old local migration ledger omits `0027_admin_payments_role.sql` even though its `role` column already exists. Therefore only migration 0029 was executed and recorded locally, without changing the existing role schema/history.

## Release procedure

1. Inspect the production migration ledger/schema and apply **only** the missing welcome-page migration.
2. Deploy code, initially disabled unless explicitly configured otherwise.
3. Copy or save only the reviewed welcome-page configuration in live admin; do not import the complete local database.
4. Test first visit, language switching, PDF URLs, registration URL, entering the website and disabling the page.
5. Future live-to-local content syncs should include `welcome_page` and media URLs in its JSON after it exists in production. Preserve the local-only preview table until then.

## Verification

`node scripts/test-welcome-page.mjs` tests settings persistence, role/origin guards, unsafe links, hide/show content preservation and bilingual URL fallback in an isolated SQLite database. Browser checks in `.wrangler/test-welcome-ui-20261121.mjs` exercise the real local admin and public pages.
