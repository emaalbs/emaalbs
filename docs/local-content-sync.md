# Live → local content sync

## Verified private-content sync — 2026-10-23

Authenticated, read-only production D1 export was compared with a fresh local backup. Content was merged into LOCAL D1 only, including unpublished drafts. Production IDs were mapped for magazines (by slug) and social posts (saved ID map); local primary keys were retained to avoid collisions.

- Imported two unpublished social posts, updated three video titles and one Edition sort order, and aligned source timestamps. The 392 gallery photos already matched.
- Verified all live content rows against the local result. Preserved local-only content, including one older social post and two archived payment demo Editions; this is not a deletion mirror.
- Verified all non-content tables unchanged, including bookings, payment events, Tabadul attempts, booking settings/limits, migrations, admin accounts, contacts and subscribers.
- Checked 524 referenced media keys: 522 existed locally and two missing hero images were downloaded and verified. Unreferenced R2 objects were not cloned. External embeds still require internet.
- Remote Git `main` and the local base both pointed to `5479a6c384e2e729a0a7e39338808236f60a3514`. Local uncommitted payment work was preserved; this Git check does not establish the provenance of an independently deployed Worker bundle.
- No push, deployment, production database write, or payment-gateway request was performed. Checkout pause and archived demo visibility remain local safeguards.

Private artifacts in `.wrangler/backups/`: `live-readonly-sync-20261023.sql`, `local-before-sync-20261023.sql`, `code-before-sync-20261023.zip`, `live-social-id-map-before-20261023.json`, and `full-sync-applied-20261023.json`. Keep SQL exports private. The dated helper in `.wrangler/` is a one-shot merge, not a reusable sync command; take new snapshots and re-plan before any future sync.

The owner's standing rule: **sync means bring live content into the offline test checkout. Never push, deploy, run a remote mutation, or publish without a separate explicit request.**

Working folder: `C:\Users\PC\Desktop\emaal-website-test`.

## Public-content fallback

On 2026-10-13 Cloudflare CLI authentication had expired. The fallback script reads public site endpoints and published gallery hydration JSON with GET only, then uses `getPlatformProxy({remoteBindings:false})` for all writes to local D1/R2.

- Articles (full bilingual content), magazine metadata/PDF references, Edition content including nested sections, IBS overview, published hero slides/settings, homepage feature, social posts and gallery categories/albums/photos are imported.
- Existing entries are updated and missing entries added. Local-only top-level entries and gallery photos are retained; this is not a destructive mirror of production deletions.
- Preview-only PDF-language columns and booking tables/configuration remain intact. Source code, admin credentials, contacts, subscribers and payment records are not replaced.
- Social posts are tracked independently even if multiple posts share the same URL. A local source-ID map is stored in `.wrangler/backups/live-social-id-map.json`.
- Referenced `/api/media/` assets are copied from the live site to local R2 if missing. Existing objects are not overwritten. Third-party embeds, remote videos and external images can still require internet.
- Unpublished drafts and unreferenced storage objects are **not available through this public fallback**. A full private-content sync requires authorized Cloudflare login; do not describe a public sync as a complete database clone.

## Safe repeat

1. Confirm the test folder and take a **fresh** local D1 SQL export into `.wrangler/backups/` using Wrangler with `--local`. Keep prior backups.
2. `node scripts/sync-live-public-to-local.mjs` collects a read-only public snapshot and reports its size. It makes no local database mutations without `--apply`.
3. Review scope, then run `node scripts/sync-live-public-to-local.mjs --apply --backup <fresh-local-export-path>`.
4. Run `node scripts/verify-public-sync.mjs <snapshot-json-path>` against the local dev server. Check the generated sync report for missing media.
5. Report copied content, limitations and local preview links. Do not deploy or push.

The 2026-10-13 pre-sync backup is `.wrangler/backups/local-before-public-sync-20261013.sql`. Snapshots, reports and SQL backups are ignored by Git. Restore only into local storage after checking the exact target; never import them into production as part of a sync.
