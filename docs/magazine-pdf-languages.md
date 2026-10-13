# Magazine PDF language versions

Deployment requires the additive migration below before publishing the application. Existing content and uploaded files must be preserved; never import the local test database into production.

## Admin

Open `/admin/magazines`, edit an existing item or create one. Under **PDF language versions / نسخ الملف**, upload English, Arabic, or both. At least one PDF is required; neither language is individually mandatory. Save is disabled during PDF uploads, and upload/save errors are displayed without navigating away. Click a filename to preview it. Removing a field detaches the file on Save; it does not delete the R2 object.

Existing files remain in `pdf_url` with no assumed language. The editor offers **Use as English** / **Use as Arabic** to move the existing reference into an empty language field without reuploading. Existing magazine slugs remain stable when editing titles.

## Public selection

Both `/[locale]/news` and `/[locale]/blog` use `magazinePdfUrl` from `src/data/magazines.ts` for magazine cards and the featured magazine link:

| Website language | First choice | If absent | Legacy fallback |
| --- | --- | --- | --- |
| English | `pdf_url_en` | `pdf_url_ar` | `pdf_url` |
| Arabic | `pdf_url_ar` | `pdf_url_en` | `pdf_url` |

This selects uploaded versions; it does not translate PDF content. Replacing one version does not change the other. The admin list provides separate EN/AR preview links.

## Storage and compatibility

`0021_magazine_pdf_languages.sql` adds two non-null columns with empty defaults; it does not copy, overwrite or delete old files. The API accepts older single-file payloads and new language-specific fields. Partial updates retain omitted fields. Server validation rejects removal of the last PDF and unsafe URL protocols.

Local migration testing used an export backup in `.wrangler/before-magazine-pdf-languages-20261013.sql`. Local uploads use local R2. The subsequent one-way content sync downloaded all referenced site-hosted media; see `docs/local-content-sync.md`. Third-party embeds still require internet.

The user's example `investment-in-iraq-perspectives-2027` was absent locally, so `scripts/prepare-magazine-preview.mjs` copied just this public item, its cover and its original PDF to local D1/R2. It skips any existing local record and does not assign an unknown PDF language. This specific example's media are available offline; other unsynced media may still require internet.

For an approved rollout: back up production D1, apply this additive migration to the correct database before deploying this code, and verify both language links. Do not replace production data with the local database. Edition booking scaffolding also requires migration `0020`; keep all offers hidden and real payments unconfigured until gateway integration is separately approved and tested.

## Tests

With `npm run dev` running on port 3000, run `node scripts/test-magazine-pdfs.mjs`. The script targets localhost and local D1/R2 only; it creates a uniquely named temporary magazine, tests real uploads through the admin inputs, saves and reloads, verifies News/Blog links in both languages and fallback with one PDF, and checks legacy assignment, validation, auth and mobile overflow. It removes only its own test magazine and uploaded objects afterward. Screenshots are under `.wrangler/magazine-pdf-qa/`.
