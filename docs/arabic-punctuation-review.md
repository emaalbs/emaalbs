# Arabic punctuation review (2026-10-20)

The original review was test-only. The owner approved live-to-local synchronization followed by publication on 2026-10-21.

## Scope

- Arabic home headings, footer tagline, gallery/social headings and IBS headings: remove decorative full stops and a comma stranded after a forced line break.
- Simplify redundant punctuation between short coordinated phrases; retain sentence-ending periods, useful commas, questions, quotations, abbreviations and decimal values.
- Correct selected Arabic CMS fields in **local D1 only**, including hero descriptions, article captions, magazine text and social titles. English text, links, images, PDF references and publication settings are preserved.
- No typography, layout, colors or animations were redesigned.
- Embedded third-party posts, text baked into images/videos and PDF documents are not edited.

## Local review

Start `npm run dev` and open `http://localhost:3000/ar`.

`scripts/review-ar-punctuation-local.mjs` lists exact proposed CMS replacements. `--apply` applies them only through local Wrangler bindings. It checks the workspace and backup, rejects other arguments, uses compare-and-update guards, and verifies that every other field remains unchanged. A second run is idempotent.

Backup: `.wrangler/backups/local-before-ar-punctuation-20261020.sql`.
Detailed before/after reports and browser captures: `.wrangler/arabic-review/`.

## Future approved publication

Code edits and CMS edits are separate. Pushing the code alone will **not** publish local database corrections. After explicit approval, review the saved exact replacements against the then-current live content and apply only approved Arabic fields, preserving any newer edits. Never upload the local database wholesale. The local booking demonstration is not a published live offer.

## Approved release preparation — 2026-10-21

Fresh local and live backups are saved under `.wrangler/backups/` with the date `20261021`. Published content was refreshed through the one-way public sync and the reviewed corrections reapplied locally. This sync does not import unpublished drafts or private admin/customer records. Two missing media objects were downloaded; existing local-only content was preserved.

The live content patch is generated from the fresh **live** backup, not from local database IDs. It applies only the exact reviewed replacements to Arabic fields, with an original-value guard against overwriting concurrent edits. It excludes the local booking demo. Release verification compares all content tables with the backup plus those expected changes, including English fields and media links. Detailed release scripts/reports remain in the ignored `.wrangler/arabic-review/` directory.
