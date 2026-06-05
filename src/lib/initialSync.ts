import { supabase } from './supabase';
import { db } from './db';
import type { Profile, Customer, Job, LineItem, WorkLogEntry, Payment } from './db';

export async function initialSync(userId: string) {
  const [profile, customers, jobs, lineItems, workLog, payments] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('customers').select('*').eq('user_id', userId),
    supabase.from('jobs').select('*').eq('user_id', userId),
    supabase.from('line_items').select('*, jobs!inner(user_id)').eq('jobs.user_id', userId),
    supabase.from('work_log').select('*, jobs!inner(user_id)').eq('jobs.user_id', userId),
    supabase.from('payments').select('*, jobs!inner(user_id)').eq('jobs.user_id', userId),
  ]);

  await db.transaction('rw', [db.profiles, db.customers, db.jobs, db.line_items, db.work_log, db.payments], async () => {
    if (profile.data) {
      await db.profiles.put({ ...(profile.data as Profile), _sync_status: 'synced' });
    }
    if (customers.data) {
      await db.customers.bulkPut(
        customers.data.map((r) => ({ ...(r as Customer), _sync_status: 'synced' }))
      );
    }
    if (jobs.data) {
      await db.jobs.bulkPut(
        jobs.data.map((r) => ({ ...(r as Job), _sync_status: 'synced' }))
      );
    }
    if (lineItems.data) {
      await db.line_items.bulkPut(
        lineItems.data.map((r) => ({ ...(r as LineItem), _sync_status: 'synced' }))
      );
    }
    if (workLog.data) {
      await db.work_log.bulkPut(
        workLog.data.map((r) => ({ ...(r as WorkLogEntry), _sync_status: 'synced' }))
      );
    }
    if (payments.data) {
      await db.payments.bulkPut(
        payments.data.map((r) => ({ ...(r as Payment), _sync_status: 'synced' }))
      );
    }
  });
}
