import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com';

let isReady = false;

export function initAnalytics() {
  if (!POSTHOG_KEY) {
    console.warn('[Analytics] PostHog key not set — events will be no-ops');
    return;
  }
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false, // SPA — we capture manually if needed
    autocapture: false,      // Keep noise low; we fire explicit events
  });
  isReady = true;
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!isReady) return;
  posthog.identify(userId, traits);
}

export function resetUser() {
  if (!isReady) return;
  posthog.reset();
}

export function capture(event: string, properties?: Record<string, unknown>) {
  if (!isReady) {
    // Silently drop when not initialised (dev mode without key, or before init)
    return;
  }
  posthog.capture(event, properties);
}

/* ─── Funnel events (typed) ─── */

export function captureUserSignedUp(trade?: string, source?: string) {
  capture('user_signed_up', { trade, source: source || 'organic' });
}

export function captureJobCreated(entryPoint: 'missed_call' | 'new_quote') {
  capture('job_created', { entry_point: entryPoint });
}

export function captureQuoteSent(sendMethod: 'whatsapp' | 'sms' | 'copy') {
  capture('quote_sent', { send_method: sendMethod });
}

export function captureJobMarkedPaid(daysSinceQuoteSent?: number | null) {
  capture('job_marked_paid', {
    days_since_quote_sent: daysSinceQuoteSent ?? null,
  });
}

export function captureUserSignedIn() {
  capture('user_signed_in');
}

export function captureJobBooked() {
  capture('job_booked');
}

export function captureJobStarted() {
  capture('job_started');
}

export function captureJobCancelled(reason: 'customer_cancelled' | 'dave_cancelled') {
  capture('job_cancelled', { reason });
}

export function capturePlanUpgraded(fromTrigger: 'cap_hit' | 'value_prompt') {
  capture('plan_upgraded', { from_trigger: fromTrigger });
}

/* ─── MVP Feature Analytics ─── */

export function captureCustomItemAdded() {
  capture('custom_item_added');
}

export function captureCustomItemUsed() {
  capture('custom_item_used');
}

export function capturePhotoAdded() {
  capture('photo_added');
}

export function captureVoiceInputUsed() {
  capture('voice_input_used');
}

export function capturePaymentChase(method: 'whatsapp' | 'sms') {
  capture('payment_chase', { method });
}

export function captureMaterialAdded() {
  capture('material_added');
}

export function captureActivityViewed() {
  capture('activity_viewed');
}
