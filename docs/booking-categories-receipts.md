# Booking categories and receipts

## Administration

Open an Edition in Admin → Seat booking & payment → Booking categories.
Each category has a stable identifier, Arabic/English name, price in the selected
currency, independent capacity, and visibility. Add/remove categories with the
provided buttons, then **Save booking settings** (independent of the Edition save).
Blank capacity means unlimited. One seat is reserved per checkout. Existing
bookings keep their original category, price, event date and venue snapshots.
Removing or hiding a category stops new orders, not outstanding payment verification.
This does not implement a numbered seating chart or assign physical chair numbers.

Legacy single-offer configurations are read as the `standard` category. Migration
0026 preserves financial history and assigns that category to old bookings.
Old bookings without event snapshots show unavailable event details rather than
inventing historical dates/venues.

## Receipt and privacy

Receipts require a paid booking, a transaction reference and a server-recorded
paid event from its provider; a return URL alone is not sufficient. A refund event
or review state invalidates the online receipt. The confirmation timestamp is when
the website received verified payment evidence, not a bank settlement timestamp.

The owner gets a receipt through their existing private booking session. Its QR
contains a separate, random **read-only receipt URL**, never their owner capability.
The QR token travels in the fragment, then an Authorization header, not a query
string. The receipt page is noindex/no-referrer and responses are private/no-store.
Sharing the QR permits reading the guest name and receipt details; email, phone,
card data, checkout URL and owner credentials are excluded. This is not a tax invoice.
QR viewing needs the site to be reachable. A localhost QR only works on that
computer; live receipts will use the live origin when this feature is released.

PDF/PNG generation runs in the guest's browser, not on the Worker. It embeds fonts
and QR into a high-resolution image; the PDF is a one-page visual receipt, not
searchable text. On-screen receipt content remains accessible HTML. Verify downloaded
Arabic/English PDFs visually after export changes.

## Local test

The private `.dev.vars` flag `LOCAL_BOOKING_SIMULATION="true"` only works in
development on loopback. It selects the mock provider and rejects explicit real
gateway preview headers. `PAYMENT_CHECKOUTS_DISABLED="true"` stays in place for real
checkout. No deployment config enables this local flag.

1. Apply additive migration 0026 to the **local** D1 database.
2. Run `node scripts/setup-local-booking-categories.mjs` once. This creates a local
   example Edition (`booking-categories-preview`) without overwriting existing offers.
3. Run `npm run dev`, then visit `/ar/ibs/booking-categories-preview#booking`.
4. Choose Guest or VIP, enter fictional details and simulate success on the status
   page. The receipt is labelled **PREVIEW — NOT VALID FOR ENTRY**.
5. Admin: `/admin/ibs/editions/booking-categories-preview#section-booking`.
   The payment history's simulation tab shows these records, separate from money.

Regression checks:

- `node scripts/test-public-payments.mjs` — isolated in-memory SQLite/fake gateway,
  legacy compatibility, tier validation/pricing/capacity, receipt auth and revocation.
- `node scripts/test-payment-core.mjs`
- `node scripts/test-tabadul-core.mjs`
- `node scripts/test-booking-tiers-ui.mjs` — local admin, Arabic mobile checkout,
  mock success, Arabic/English downloads and QR decoding. Blocks external requests.
- `node scripts/test-payment-history.mjs` — local synthetic ledger tests, cleaned up.
- `npm run build`

## Release procedure

Publish only after explicit user approval. Before a release, back up live data,
apply migration 0026 before the new code, and preserve live settings and bookings.
Do not upload the local database, demonstration Edition, simulated payments,
`.dev.vars`, receipt artifacts or local secrets. Verify the production sandbox
guard, existing offers, authenticated history and guest checkout after deployment.
