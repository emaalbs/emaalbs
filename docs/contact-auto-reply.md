# Visitor contact acknowledgement

The About page links to the Contact form. `/api/contact` saves each valid inquiry,
then independently runs the existing organizer notification and a visitor reply.
The reply uses the owner's exact English text. It never includes user-provided
message text, links, or the organizer's notification recipient list.

## Current status

Implemented and tested locally with a fake transport. Production configuration
and migration are prepared; delivery remains disabled until deployment and
provider verification are complete.
Existing Cloudflare Email Routing notifications only support verified destination
addresses in this setup; they cannot deliver replies to arbitrary visitors.
The owner selected Resend Free and confirmed account creation on 2026-11-23.
Resend API access was verified and `replies.emaalbs.com` was created on 2026-11-23
(domain ID `c18c0273-af46-4bec-8af4-d82d0e5ffa81`, region `eu-west-1`).
Sending is enabled, receiving disabled. The owner imported the four dedicated
subdomain DNS records into Cloudflare. Public DNS matches all four expected
records; root Google Workspace MX remains unchanged. Resend has verified DKIM
and the Forge CNAME, while its SPF verification is pending.
A sending-only key restricted to this domain is stored as the Worker secret
`RESEND_API_KEY`. Sender: `notifications@replies.emaalbs.com`; Reply-To:
`qnuoot@emaalbs.com`. The temporary setup key must be revoked after delivery
verification. Never print or commit either key.
Migration `0030_contact_auto_replies.sql` was applied to production after a
private database backup, without importing local content. The active Wrangler config is in
`APPDATA/xdg.config/.wrangler/config/default.toml`, including the leading dot;
the other `wrangler` folder contains a stale credential.
No paid subscription was enabled. Existing organizer notifications are unchanged.

## Activation after provider setup

1. Verify a dedicated sending subdomain in Resend; preserve the root Google
   Workspace MX records and the existing Cloudflare notification subdomain.
2. Apply only `0030_contact_auto_replies.sql` to the target database and record it
   in the migration ledger. Do not import the local database into production.
3. Store `RESEND_API_KEY` as a Worker secret; never use a `NEXT_PUBLIC_` variable
   or commit it. Configure `CONTACT_AUTO_REPLY_FROM` to the verified sender and
   optionally `CONTACT_AUTO_REPLY_REPLY_TO` to the team's monitored inbox.
4. Deploy the reviewed code with `CONTACT_AUTO_REPLY_ENABLED` absent/false.
   Once configured and approved for real delivery, set it to `true`.
5. Test with an owner-controlled email address. Provider acceptance does not
   prove inbox delivery; confirm receipt separately.

No auto-replies are sent in local development, even if credentials exist. No
historical inquiries are replayed. A database claim prevents duplicate replies
for the same contact and limits repeated replies to an address to once per 15
minutes. The Resend request also carries a per-contact idempotency key. Provider
timeouts, network failures and server errors remain `unconfirmed` with no automatic
retry. Results are recorded in `contact_auto_replies`, separate from organizer
notifications. Failed delivery never changes a successful contact submission.

Validation: `node scripts/test-contact-auto-reply.mjs`,
`node scripts/test-contact-email.mjs`, and `npx tsc --noEmit`.

References:
- https://developers.cloudflare.com/email-service/
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/emails/idempotency-keys
