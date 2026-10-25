# Customer reviews — staged, not activated

The original nine reviews remain in app/reviews.json, in their original order and wording. A pre-change copy is in backups/reviews-2026-10-25/reviews.json. Existing global styles and review cards have not been edited. New site submissions render separately after the legacy reviews and identify their source as the website.

## Activation prerequisites

1. Connect an owner-controlled Supabase project (no paid plan authorized). Apply supabase/migrations/20261025_customer_reviews.sql and deploy the reviews Edge Function. Keep JWT gateway verification disabled only for this function: public requests use Turnstile; every admin request separately validates the JWT with Supabase Auth and checks a server-side allowlist.
2. Create the owner's Auth user through the Supabase dashboard. Disable public signup. Add only that user's UUID to private.review_admins using the SQL editor: INSERT INTO private.review_admins(user_id) VALUES ('OWNER_AUTH_USER_UUID'); Replace the placeholder with the actual verified owner UUID. There is no browser-side role assignment. Configure Auth brute-force limits and strong credentials. Admin tokens are in memory only, lost on reload; expiration requires signing in again.
3. Create a Cloudflare Turnstile widget for the production hostname. Configure its public site key in Vercel and secret in Edge Function secrets. No testing keys in production.
4. Set Edge secrets SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY, REVIEW_RATE_LIMIT_SALT (random 32 bytes or more), REVIEW_ALLOWED_ORIGINS (exact comma-separated HTTPS origins). Never expose the service-role key in NEXT_PUBLIC variables. Confirm trusted client-IP forwarding at the deployed Supabase gateway before relying on IP-based limits.
5. Set the public build variables listed in .env.reviews.example. NEXT_PUBLIC_REVIEW_API_URL is the deployed Edge Function endpoint. Rebuild after setting variables.
6. Once Google Business verification completes, copy the official “ask for reviews” URL from the owner's profile into NEXT_PUBLIC_GOOGLE_REVIEW_URL. Never construct it from an account or location ID. Until provided, no Google button appears. Every rating receives the same Google invitation.
7. BEFORE production rollout, test actual insert/pending state, admin denial, owner approval/rejection/removal, public visibility, persistence after reload, spam/rate limits, and failure recovery against the real project. Check desktop, iPhone and tablet; compare unchanged areas and original reviews; validate keyboard focus and reduced motion. Then deploy to production and repeat checks.

## Current validation and limitations

Nine mocked handler tests cover validation, public-only approved reads, admin access, captcha, throttling, DB failure, forced pending status, concurrency and origin restrictions. They do not prove real database permissions, SQL execution, CAPTCHA hostname validation in production, admin login or durable storage. No production database is connected yet. This work must not be described as a live functioning review system until the activation checks pass.

Run tests: node --experimental-strip-types --test tests/reviews.test.mts
Run frontend check: pnpm build

Moderation removal is a reversible soft removal with an audit trail. Personal-data erasure, when requested, must be handled by the owner in the database, including relevant audit references. Back up the database using the provider's available export tools; no paid backup feature is authorized.

Any future Google review display must use an authorized Google API or approved integration under Google's terms, with proper attribution. It is deliberately outside this implementation; no scraping, paid widget or automatic cross-posting exists.

## Deferred activation — owner decision
Server, database and Google API integration are postponed until the owner approves the completed website. Keep public configuration empty until then. The submission button is hidden unless both the review endpoint and CAPTCHA site key are configured; the Google button is hidden without a valid owner-provided review URL. No placeholder button or coming-soon dialog is exposed on the unconfigured public page. The form and moderation source remain prepared for later activation. Never display a success message without a confirmed database save.
