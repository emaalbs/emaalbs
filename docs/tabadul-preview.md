# Tabadul — local integration preview (2026-10-23)

> **Current state: preview retired at the owner's request.** The owner subsequently completed an actual IQD 1,000 payment, confirmed by Tabadul and the local ledger. Both demo editions are now unpublished; new checkouts/simulators are paused, and financial history is retained. See `payment-release-readiness.md`. The instructions below describe the earlier test setup, not an instruction to re-enable it or deploy it.

This is LOCAL website work only. No deployment, live website database writes or Git push. The owner confirmed the supplied Tabadul account is production and requested a private IQD 1,000 pilot. One UNPAID registration was made at the real gateway, followed by read-only status requests. The hosted form displayed **Pay 1,000 IQD** for API amount `1000000`, currency `368`. No card, CVV, OTP or payment submission occurred. Server-only credentials were imported to ignored `.dev.vars`; never copy this file or the supplied archives to GitHub.

## Try it without money

Apply migrations `0022` through `0024` to LOCAL D1 only, then `npm run dev`.
`node scripts/prepare-tabadul-preview.mjs` creates a dedicated local-only IQD 1,000 simulation edition without changing existing offers. It preserves the demo if already present. Never sync this demo up to live.
Open an edition with an enabled local booking offer and append `?paymentPreview=tabadul#booking`, for example:
`http://localhost:3000/ar/ibs/tabadul-payment-preview?paymentPreview=tabadul#booking`.

Enter dummy guest details and accept the terms. The resulting booking page shows success, decline, cancel, authorization-only and refund simulation buttons. No card fields exist. The simulator does NOT contact Tabadul; it returns representative register/status responses to the same parser used by the real adapter. A simulator response is not evidence of gateway acceptance.

`/admin/bookings` labels `tabadul-preview` separately from actual `tabadul` payments. Existing mock bookings and all other content remain unchanged. Ordinary local booking links still use the old mock provider.

## Implementation and safeguards

- POST form encoding to fixed HTTPS Tabadul endpoints, no redirects, 12-second timeout and bounded response size. Credentials remain server-only, never query strings or logs.
- Deterministic 32-character merchant order number derived from the booking UUID. Amount comes from the saved offer, not the client. This adapter currently accepts IQD only.
- Atomic single registration claim per booking. If registration times out or becomes uncertain, do NOT re-register automatically. Contact the provider using the merchant order number; recovery by that number needs their documented status-extended API. Customer sees a tracking reference even when registration fails.
- Observed account behavior: the gateway returns a generated numeric `OrderNumber`, different from the submitted UUID-based merchant number. Immediately after registration, query the returned session using server credentials; require status 0, exact description, amount and currency, then pin its order number in `ibs_tabadul_attempts.gateway_order_number`. Only then expose checkout. Subsequent status calls must match the pinned number. Never learn a new number from a paid response. Session IDs are retained if this pre-check fails; do not blindly re-register.
- Checkout URL is HTTPS and hostname-allowlisted. No card processing or saved-card bindings in our app.
- Return URLs/query strings never mark a booking paid. Capability-protected POST verification calls getOrderStatus from the server; matches merchant order number, amount and currency; throttles to one check per booking per 15 seconds.
- Status 0 stays pending, 1 stays pending by default, 2 is paid (exact deposit amount required if supplied), 3 cancelled, 6 failed, 4 goes to organizer review, not automatic refund. Any missing identity/amount or unknown status fails closed. Late successful payment goes to review; delayed failures do not undo confirmed payment.
- Both simulation routes and the real-money pilot reject production/LAN/public requests. A real-money checkout also requires a local admin session, explicit user consent, the approved edition and a hard maximum of IQD 1,000.
- The existing signed bridge webhook is NOT a Tabadul webhook. No Tabadul webhook format was supplied. Automatic background reconciliation and return flows without the original tab require further work before a public launch. Local admins can POST `/api/admin/bookings/:id/verify-payment` to reconcile a known session independently of the customer's tab.
- Browser sessionStorage holds the booking capability; keep the same origin/browser tab on return. Canonical host changes or lost tabs require admin follow-up. No new customer accounts were added.

## Private real-money pilot — local admin only

Local setup uses a separate edition `tabadul-live-pilot`, IQD 1,000, capacity one. It clearly says this is an actual-money test, not a summit ticket, and promises no automatic refund. Local admin sign-in and an explicit real-payment checkbox are mandatory. These settings are server-only in ignored `.dev.vars` (values below describe this authorized local pilot, not production deployment):

```
TABADUL_LIVE_ENABLED=true
TABADUL_PILOT_ACKNOWLEDGED=true
TABADUL_USERNAME=<server-only API user, not portal login>
TABADUL_PASSWORD=<server-only API password>
TABADUL_IQD_UNITS_PER_DINAR=1000
TABADUL_PAID_STATUS=2
TABADUL_CHECKOUT_HOSTS=epg.tabadul.iq
TABADUL_TEST_EDITION=tabadul-live-pilot
```

Sign into `http://localhost:3000/admin/login` in the same browser, then visit `http://localhost:3000/ar/ibs/tabadul-live-pilot?paymentPreview=tabadul-real#booking`. Review IQD 1,000 on Tabadul's page BEFORE entering any card data. Only the owner enters card/CVV/OTP directly on that provider page. Do not send card data to the agent or chat. Return in the same browser/tab. If the bank reports a debit but the site is pending/review, **do not pay again**: use admin verification and reconcile with Tabadul. Conservative status 2 is required for success; status 1 is not assumed paid. Full payment/3DS and account-specific final-success behavior remain untested until the owner performs this trial. Do not run live registration in automated regression tests.

The pilot checks the local admin session before submitting checkout. Missing/expired sessions display explicit Arabic/English guidance and an admin-login link opening in a separate tab; form values remain in the original tab. A live-site login or login in another browser does not authenticate localhost. The server still independently requires auth; the preflight is UX, not a replacement for access control.

This loopback pilot uses the exact request origin for return to preserve access tokens. If Tabadul does not permit localhost return URLs, stop: arrange an authenticated HTTPS preview and review its security/return configuration separately. Do not publish merely to work around this limitation.

## Provider questions still open

Current version of the supplied 2021 v1.33 excerpts; final success interpretation of state 1; signed webhook/retries; full refund/status-extended APIs; fixed-IP requirement; production checkout/return host restrictions. IQD amount scaling and checkout hostname were observed directly, and registration accepted a localhost return URL; successful return after 3DS is not yet tested. The supplied Postman sample has `currancy` rather than documented `currency`, `Phone` rather than `phone`, and an unrelated return URL; it must not be run unchanged.

## Admin payment history

`http://localhost:3000/admin/payments` (Payments / المدفوعات) shows payer name, email, phone, requested amount/currency, status, edition, booking/session/transaction references, creation time, first received paid-confirmation time and event timeline. Dates are Baghdad time. Search, status/currency/date filters and pagination are available. Summary covers all filtered rows, not only the current page, and never combines currencies. Real providers (`tabadul`, `bridge`) and simulation (`mock`, `tabadul-preview`) are separated. Totals require a paid event plus current paid status; unverified legacy paid records, refunds and late-payment review are excluded and flagged. Gross amounts are BEFORE provider fees: they are not net settlement, bank balances or accounting profit. No fabricated commissions/refunds. Verification reads gateway status and does not charge/refund. API is authenticated and no-store; access hashes and checkout URLs are not returned.

One local technical probe is retained as an unpaid/pending-or-expired real-gateway order, explicitly named `فحص تقني — طلب غير مدفوع`. Do not delete it as a fake fixture. Automated history fixtures are removed after each test. Neither of the local demo editions nor their bookings should ever be synced to the live website.

## Tests

`node scripts/test-tabadul-core.mjs` — pure adapter tests, no network.
`node scripts/test-tabadul-preview.mjs` — local API, local D1, temporary fixtures only; no real provider.
`node scripts/test-tabadul-ui.mjs` — EN desktop and AR mobile, simulation/confirmation/admin UI; cleans its own dummy bookings; explicitly blocks gateway requests.
`node scripts/test-payment-history.mjs` — auth, currency-safe totals, pagination, paid evidence, refund/review exclusion, Baghdad dates, safe fields, timeline and Arabic desktop/mobile history; deletes only its own fixtures.
`node scripts/test-pilot-login.mjs` — local missing-session UI, preserved form, blocked checkout and server rejection after session expiry; no gateway calls or booking creation.
Existing `node scripts/test-payment-core.mjs` and `node scripts/test-bookings.mjs` remain applicable.
Public rollout is a separate, explicitly approved task after provider contract and operational reconciliation are complete.

## Verification completed 2026-10-23

Passed: TypeScript, Next production build, pure payment/Tabadul tests, local API regression tests, desktop English and mobile Arabic browser flows, admin verification, and real-money lock tests. Compared 29 existing local tables with the pre-work backup: existing content and bookings were unchanged (apart from the separate local demo, migration and test rate-limit counters). Dummy test bookings were removed; no existing user bookings were removed. Screenshots are ignored under `.wrangler/tabadul-qa/`. Backup: `.wrangler/backups/local-before-tabadul-preview-20261023.sql`.

Subsequent checks: authenticated connectivity, unpaid registration, hosted IQD 1,000 amount, generated gateway-number pinning and pending-status verification succeeded. Backup before history work: `.wrangler/backups/local-before-payment-history-20261023.sql`. Still NOT tested: real card payment, hosted 3DS, settlement or refund. No live website changes, remote database migrations or Git pushes were performed.
