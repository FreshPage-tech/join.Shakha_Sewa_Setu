# Leader-BEE Stripe Checkout setup

The registration page uses a Supabase Edge Function to create Stripe Checkout Sessions. The server always calculates the fee as **$10 × number of children**; the browser cannot supply or change the unit price.

## 1. Add server secrets

From the repository root, log in and link the existing Supabase project if needed, then add the Stripe secret key:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set STRIPE_SECRET_KEY=sk_test_REPLACE_ME
supabase secrets set LEADER_BEE_SITE_URL=https://join.shakhasewasetu.com
```

Use a Stripe test secret (`sk_test_...`) while testing. Switch to the live secret (`sk_live_...`) only when ready to accept real payments. Never place either key in HTML, JavaScript, Git, or a `VITE_` variable.

## 2. Deploy the checkout function

```bash
supabase functions deploy create-leader-bee-checkout
```

The endpoint will be:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-leader-bee-checkout
```

## 3. Connect the page

Set that endpoint in `public/register-leader-bee/js/config.js`:

```js
window.LEADER_BEE_CONFIG = {
  checkoutApiUrl: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-leader-bee-checkout',
}
```

Rebuild and deploy the site. `config.js` contains only the public function URL; it must not contain the Stripe secret key.

## 4. Test

Register two children and confirm Stripe Checkout shows quantity `2` and total `$20.00`. In test mode, use Stripe's test card `4242 4242 4242 4242`, any future expiry date, and any CVC.

For production bookkeeping, add a Stripe `checkout.session.completed` webhook that records the paid session ID and payment status in Supabase. Do not treat the success-page redirect alone as proof of payment.
