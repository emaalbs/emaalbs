# Live → local content sync

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
