# Contact email notifications

Administrators manage up to two destination addresses at `/admin/contacts`.
The second address is optional. Empty settings start disabled. Changes affect new
contact submissions only; saving settings does not send or replay messages.
Payments-only accounts cannot read, change, or test these settings.

## Before releasing

1. Apply `db/migrations/0028_contact_email_notifications.sql` to the target D1
   database before deploying this code. It only adds settings and delivery tables;
   it does not modify existing contacts. Register the migration when executing it
   directly rather than via Wrangler migrations.
2. Deploy with the `CONTACT_EMAIL` send-email binding in `wrangler.jsonc`.
3. In Cloudflare **Email Service → Email Sending**, configure/verify sending for
   `emaalbs.com`. The sender is `notifications@emaalbs.com`. Keep existing inbound
   mail/MX configuration intact; sending-domain setup is distinct from mail routing.
4. Depending on the account plan, destination addresses must be verified in
   Cloudflare before they can receive notifications. The user chooses these later.
5. Save the recipient addresses and enable notifications in Contacts, then use
   **Test email**. Confirm actual arrival in the recipient inbox/spam folder.

The app does not contain an SMTP password or store email provider credentials in
the browser. Cloudflare's native Worker binding performs sending. A configured
binding does not by itself prove domain activation or inbox delivery. Admin UI
shows this distinction and exposes safe actionable provider failure messages.

## Delivery behavior

- Save the contact first, then send notifications using the Worker execution context.
- Each configured address gets a separate message, keeping recipients private and
  allowing one address to succeed independently of the other.
- Replies go to the visitor; the visitor cannot change the sender or notification
  destinations. All visitor text is escaped in HTML email.
- Contact creation succeeds even when the email service fails.
- `accepted` means the provider accepted the email, not confirmed inbox delivery.
- Provider errors are recorded per recipient. A timeout is `unconfirmed`, because
  the provider might still deliver. There is no automatic retry that could duplicate
  an unconfirmed message. Review Cloudflare logs before resending anything.
- Tests use saved recipients, are authenticated, and are limited to one per minute.
- Local development never claims to send real email, even if Miniflare supplies a
  simulated email binding. Tests use an isolated database and fake transport.

## Validation

```
node scripts/test-contact-email.mjs
node scripts/test-admin-access.mjs
node node_modules/typescript/bin/tsc --noEmit
```

Provider references:
- https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/email-service/get-started/send-emails/
