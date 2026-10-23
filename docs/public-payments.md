# Public Tabadul payments

This supersedes the local-pilot instructions for **public production**. Existing local pilots remain retired and local checkout remains paused. No pilot pages, credentials, customer records or local databases are deployment inputs.

## Organizer controls

In Admin → IBS Editions → edit an Edition → Seat booking & payment:

- Enter bilingual title, description, button text and booking/cancellation terms.
- Enter the actual per-seat price in IQD (not API minor units). USD is not supported by this Tabadul account integration.
- Set total capacity, or leave blank for unlimited. One unit is reserved per checkout.
- Enable Show booking section and save **booking settings**. Every Edition is independent; new offers are hidden by default. The Edition itself must also be published.
- Turning visibility off blocks new reservations. Existing payments can still settle. Price/terms changes do not rewrite existing reservations.

Admin → Payments shows real payments separately from simulations, payer details, requested amount, verified status, confirmation time, references and last verification. Totals are gross verified payments, **not** bank settlements or net-of-fee revenue. Late payments and refund notifications require manual review. Refunds are handled with the provider; this site does not initiate refunds or send confirmation email/QR tickets.

## Production configuration (server-only)

Set `PAYMENT_PROVIDER=tabadul`, `PAYMENT_PUBLIC_ORIGIN=https://emaalbs.com`, `TABADUL_LIVE_ENABLED=true`, `TABADUL_IQD_UNITS_PER_DINAR=1000`, `TABADUL_PAID_STATUS=2`, `TABADUL_CHECKOUT_HOSTS=epg.tabadul.iq`, `PAYMENT_CHECKOUTS_DISABLED=false`. Store `TABADUL_USERNAME`, `TABADUL_PASSWORD` and random 32+ character `PAYMENT_RECONCILE_SECRET` as Worker secrets. Do not use `NEXT_PUBLIC_*`, commit credentials, or remove local-pilot guards to enable production.

`PAYMENT_CHECKOUTS_DISABLED=true` is an emergency stop for NEW checkouts only. Keep verification and the scheduler running to reconcile already-started payments.

The production admin signing key is now a rotated `ADMIN_SESSION_SECRET` Worker secret, not a tracked variable. Existing usernames/passwords remain unchanged; old admin sessions must sign in again. `ADMIN_SECRET` is supported only as a compatibility/local fallback. Never restore the retired exposed signing key from Git history.

## Verification and recovery

- The server chooses Tabadul. Client preview flags cannot enable public simulations or real-money pilots.
- Public checkout requires the canonical HTTPS origin. www Edition/receipt pages redirect to the canonical host before checkout. Return URLs are not proof of payment.
- A random per-booking bearer capability authorizes receipt access. An HttpOnly, Secure, SameSite=Lax, host-only cookie scoped to that booking API supports return/new-tab recovery in the same browser for 30 days. No capability is included in URLs. A different browser or cleared cookies requires organizer assistance, not disclosure by booking ID alone.
- Price/currency/capacity come from persisted admin settings. A single atomic insertion reserves capacity; retries use the same idempotency key and gateway registration claim. An uncertain registration is never blindly repeated.
- The gateway's generated order number is pinned from authenticated pending registration status, matching exact description, amount and currency before exposing checkout. Every subsequent result must match it, amount, currency and session. Only final state 2 confirms payment. State 6/ErrorCode 2 is accepted only as identity-bound decline; it can never produce success.
- `worker.ts` wraps OpenNext and schedules reconciliation every 5 minutes. Its internal endpoint authenticates a secret and makes **status queries only**, with atomic job claims and bounded concurrency (20 due records per invocation). Pending bookings in their first day are due every 5 minutes; other recent outcomes every 6 hours. Records are revisited for 7 days; older records can still be checked manually from Payments. This is polling, not a vendor webhook. At sustained volume above 20 newly-due records per 5 minutes, increase throughput after checking provider limits.
- Successful payment after reservation expiry/failure goes to review; failed/late notifications never downgrade paid bookings. Unknown/mismatched responses preserve the previous state, record a safe error and retry. Registration uncertainty or missing pinned identity requires operator follow-up with Tabadul.
- Financial events are append-only/idempotent. Do not delete or fabricate paid records. Keep backups private. Never run local-to-live database imports as a release step.

## Release and rollback

Back up live D1, apply additive migrations 0022–0025, install Worker secrets, build on Linux via GitHub Actions and deploy code only. Preserve all existing content/admin accounts. Leave offers hidden for the owner to configure. Check production health, protected admin endpoints, paused/hidden offer behavior, canonical redirects, forbidden simulators and a secret-authenticated reconciliation invocation. No automated real registration/card payment is part of smoke testing.

An earlier private payment confirmed gateway connectivity and amount scaling, but is **not** evidence of a real-domain end-to-end payment. After selecting an offer, the owner should complete one intentional live-domain payment and review the ledger before promoting sales. Do not retry if the bank reports a charge while the site awaits confirmation.

For an incident, set the checkout pause first, retain reconciliation, and roll back the Worker code if needed. Migrations are additive and must not be destructively reversed. Keep the pre-release deployment version ID in the private release record. A rollback without a scheduled handler must also remove its cron trigger.

Tests: `test-payment-core.mjs`, `test-tabadul-core.mjs`, `test-public-payments.mjs` (isolated in-memory DB, fake gateway only), plus authenticated local history/browser regressions. Cloudflare scheduler references: https://developers.cloudflare.com/workers/configuration/cron-triggers/ and https://opennext.js.org/cloudflare/howtos/custom-worker.
