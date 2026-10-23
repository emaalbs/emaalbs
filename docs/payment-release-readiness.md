# Payment preview retired — local only, 2026-10-23

**Update:** the owner subsequently authorized public rollout with offers configured independently in Admin. The implementation and operational contract are now in `public-payments.md`; the historical limitations below describe the retired local-pilot baseline, not the completed public adapter. Keep the private trial records archived.

## Completed

- Owner completed a real IQD 1,000 payment; authenticated gateway status and the local ledger both confirmed paid (gateway state 2, matching amount/currency/order). No refund was requested or performed.
- Local-only editions `tabadul-payment-preview` and `tabadul-live-pilot` are unpublished and their booking offers disabled. Their records remain recoverable; no financial history was deleted.
- `.dev.vars` now contains `PAYMENT_CHECKOUTS_DISABLED="true"`. This hides booking sections, refuses all new checkout modes, and disables simulator writes. Existing receipt access, admin history and gateway verification remain available.
- Existing real edition content and ALL booking/event/attempt records were hash-compared before/after retirement and unchanged.
- Full local backup: `.wrangler/backups/local-before-payment-cleanup-20261023.sql`. Per-edition recovery snapshot: `.wrangler/backups/payment-previews-before-archive-*.json`. Backups contain private data: never publish them.
- `scripts/archive-local-payment-previews.mjs --local-only` performs the reversible retirement. It has no remote mode. `scripts/test-payment-preview-cleanup.mjs` verifies the retired state without gateway calls or paid fixtures.

## Not a public payment launch

No push, deployment, remote migration or content sync was performed. The adapter still intentionally requires localhost/development/admin for actual-money testing. Merely removing the pause is NOT a public rollout. Do not remove those safeguards blindly.

Before a separately approved live launch:

1. Select the genuine Edition, price, capacity and customer-facing terms. The retired IQD 1,000 pilot is not a real event offer.
2. Implement/review public server-configured Tabadul checkout, guest/capability authentication, canonical HTTPS return handling and server-only production secrets. Customer payment must not require access to admin.
3. Add and test reliable reconciliation when a customer does not return. The bridge webhook is NOT a Tabadul webhook; do not claim otherwise. Provider-declined status 6 with ErrorCode 2 was observed and currently fails closed in the parser rather than updating the ledger; handle this documented case with strict identity/amount checks before release.
4. Verify failure, duplicate callbacks/requests, expiry, refunds/manual support, and real-domain 3DS/return behavior. The first owner trial timed out at 3dss.tabadul.iq:9601; a subsequent trial succeeded. That does not establish the cause of the first failure.
5. Back up LIVE D1 separately, apply only required schema/code changes after approval, and preserve LIVE content. Never replace live D1 with local D1; never publish demo editions, synthetic bookings, `.dev.vars`, archives, SQL backups or gateway credentials. Preserve the local real-payment ledger before any future live-to-local sync as well.

Regression scripts which require active demo offers are not applicable to the retired configuration. Use an isolated test database for future integration work; do not silently re-enable the owner's archived offers or live-money pilot.
