// Set this after deploying the Supabase Edge Function. This file is safe to publish;
// never put STRIPE_SECRET_KEY here.
window.LEADER_BEE_CONFIG = {
  checkoutApiUrl: 'https://vxznjyhlbirtnrliqunm.supabase.co/functions/v1/create-leader-bee-checkout',
  registrationApiUrl: 'https://vxznjyhlbirtnrliqunm.supabase.co/functions/v1/save-leader-bee-registration',
}
