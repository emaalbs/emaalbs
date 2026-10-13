# Optional Edition bookings

Each edition has an independent, hidden-by-default offer. Existing edition content is unchanged. One checkout reserves one seat/service unit. The foundation can be deployed with every offer hidden; real payments require the separate gateway integration described below. Never copy local demo offers or mock bookings into production.

## Local use

1. `npm run migrate:local` applies the additive `0020_edition_bookings.sql` migration to local D1 only.
2. `npm run dev`, then open `http://localhost:3000/admin/ibs/editions`.
3. Edit an edition → **Seat booking & payment**. Enter both languages, price, currency, optional terms and capacity. Toggle visibility and click **Save booking settings** (separate from the edition's general Save button).
4. For a new edition, save it first and reopen it. Optional bookings are initially hidden.
5. Open the edition's `#booking` section. Submit the guest details to try success, failure or cancellation. Mock payments are available only on loopback hosts in Next development, never in production or on LAN addresses.
6. View **IBS Bookings** in the admin sidebar, or **View bookings** for the selected edition.

Local D1/R2 are used by default without Cloudflare login. `LOCAL_REMOTE_BINDINGS=true` is an explicit opt-in for remote development bindings such as Workers AI; translation may be unavailable offline. This setting does not affect production bindings.

## Gateway contract — real integration still required

No commercial gateway has been selected or integrated. `src/lib/payments/provider.ts` defines `PaymentProvider`. Its bridge adapter is an integration contract, not a working universal payment gateway. Implement a provider-specific adapter or a trusted server-side bridge for the selected vendor, then test against that vendor's sandbox before enabling real payments.

Server-only configuration, never entered in admin fields or exposed with `NEXT_PUBLIC_`:

| Setting | Purpose |
| --- | --- |
| `PAYMENT_PROVIDER=bridge` | Enable configured adapter |
| `PAYMENT_BRIDGE_URL` | HTTPS session-creation endpoint of your trusted integration service |
| `PAYMENT_BRIDGE_TOKEN` | Secret bearer credential for that service |
| `PAYMENT_CHECKOUT_HOSTS` | Comma-separated exact allowed hosted-checkout hostnames |
| `PAYMENT_WEBHOOK_SECRET` | Random secret of at least 32 characters, shared with your bridge |
| `PAYMENT_PUBLIC_ORIGIN` | Canonical HTTPS origin, e.g. `https://emaalbs.com` (no trailing slash) |

The adapter POSTs JSON to the bridge with bearer authentication and `Idempotency-Key: <bookingId>`:

```json
{
  "bookingId": "uuid",
  "amountMinor": 150000000,
  "currency": "IQD",
  "title": "Summit access",
  "expiresAt": 1791034000000,
  "returnUrl": "https://example.com/en/booking/uuid",
  "webhookUrl": "https://example.com/api/payments/webhook/bridge"
}
```

Response: `{ "sessionId": "gateway-session", "checkoutUrl": "https://allowed-gateway.example/checkout/..." }`.

The bridge must return the **same session for repeated booking IDs**, charge the exact supplied amount/currency, honor the hold expiry, and authenticate/verify the vendor's original events before translating them into this app's event format. Timeouts retain the pending reservation; retry the same idempotency key, do not create a second charge.

Amounts are integer minor units: USD × 100; IQD × 1000. Example above is IQD 150,000. Convert explicitly if a vendor expects major units or has different currency support.

## Signed payment notifications

`POST /api/payments/webhook/bridge` accepts:

```json
{
  "eventId": "unique-gateway-event",
  "bookingId": "uuid",
  "sessionId": "gateway-session",
  "transactionId": "gateway-transaction",
  "status": "paid",
  "amountMinor": 150000000,
  "currency": "IQD"
}
```

Statuses: `paid`, `failed`, `cancelled`. For failure/cancellation before a transaction exists, the bridge should provide a stable attempt identifier as `transactionId`.

- `x-payment-timestamp`: Unix seconds.
- `x-payment-signature`: hex HMAC-SHA256 of `<timestamp>.<exact raw JSON body>`, using `PAYMENT_WEBHOOK_SECRET`.
- Timestamp tolerance is five minutes. Retries reuse the same `eventId` with a fresh signed timestamp.
- Retry non-2xx delivery with bounded backoff. A notification arriving before its checkout session was persisted returns 409 and must be retried. Escalate persistent amount/session/transaction mismatches to the operator.
- Duplicate events are ignored atomically. Already paid bookings cannot be downgraded by delayed failures.
- A redirect, query parameter, or client request never marks a real booking paid.

## Other routes and controls

- `GET/PUT /api/ibs/editions/:slug/booking`: authenticated admin settings; PUT requires same-origin.
- `POST /api/bookings/checkout`: same-origin; customer details, slug, locale and acceptedTerms; random 64-hex `Idempotency-Key`. Server reads the price, stores offer/terms snapshots and atomically enforces capacity for published editions.
- `GET /api/bookings/:id`: secret bearer capability (the original idempotency key), held in sessionStorage. A reference number alone exposes no booking data. Keep the original browser tab through hosted checkout.
- `POST /api/payments/mock`: development loopback only, same-origin and capability protected.
- `GET /api/admin/bookings?edition=slug&page=1`: authenticated, paginated guest list (50/page), no capability tokens or checkout URLs returned.
- Responses use `no-store`; raw request bodies are limited to 24 KB. New reservation attempts are limited to 15 per 10-minute window per hashed Cloudflare client IP.

## Inventory and operations

Pending seats expire after 20 minutes and then stop consuming capacity. Failed/cancelled payments release their hold. Paid and review states consume capacity. A paid notification after expiry/failure/cancellation is marked **review**, not automatically confirmed; an operator must reconcile it with the vendor and arrange a seat or refund. No automatic refunds, receipts, ticket QR codes, emails or reconciliation job are included in this foundation. The app does not collect card details.

Hiding an offer prevents new reservations but permits already started payments to finish. Editing an offer does not change the price/terms of existing bookings. Deleting an edition does not delete its booking history. Set appropriate retention/access policies for customer contact data before production.

## Before any future live rollout (requires owner's approval)

Back up production D1; apply the additive migration before deploying code; keep offers hidden; configure secrets and the real vendor sandbox integration; test signed callbacks, retries, declines, late payments, refunds and canonical-domain returns; confirm currency/tax/terms and contact arrangements. Then approve production credentials and enable selected offers. Do not copy local demo configuration or mock bookings into production. Do not run deploy, push or remote migration commands as part of local testing.

## Checks

`node scripts/test-payment-core.mjs` validates signatures, replay timing, local-only mock selection, states and configuration.

With the local dev server running: `node scripts/test-bookings.mjs` checks actual API/D1 behavior including concurrent last-seat requests, idempotency, auth, price tampering, success/failure/cancel, late payments, expiry and hidden offers. It creates and removes only its own temporary edition/bookings in local D1. Frequent repeated test runs may reach the local 10-minute attempt limit.
