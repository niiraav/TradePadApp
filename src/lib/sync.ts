import { supabase } from './supabase';
import { db } from './db';
import type { SyncQueueItem } from './db';

export async function syncWorker() {
  if (!navigator.onLine) return;

  const pending = await db.sync_queue.orderBy('created_at').toArray();

  for (const item of pending) {
    try {
      await pushToSupabase(item);
      await db.sync_queue.delete(item.id as number);
      const table = db[item.table_name as keyof typeof db] as unknown as { update: (id: string, data: Record<string, unknown>) => Promise<void> };
      await table.update(item.record_id, { _sync_status: 'synced' as string });
    } catch {
      await db.sync_queue.update(item.id as number, { retry_count: item.retry_count + 1 });
    }
  }
}

async function pushToSupabase(item: SyncQueueItem) {
  const { operation, table_name, record_id, payload } = item;
  const table = supabase.from(table_name);

  if (operation === 'insert') {
    await table.insert(payload);
  } else if (operation === 'update') {
    await table.update(payload).eq('id', record_id);
  } else if (operation === 'delete') {
    await table.delete().eq('id', record_id);
  }
}

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
      await db.profiles.put({ ...profile.data, _sync_status: 'synced' as const });
    }
    if (customers.data) {
      await db.customers.bulkPut(customers.data.map((r) => ({ ...r, _sync_status: 'synced' as const })) as any);
    }
    if (jobs.data) {
      await db.jobs.bulkPut(jobs.data.map((r) => ({ ...r, _sync_status: 'synced' as const })) as any);
    }
    if (lineItems.data) {
      await db.line_items.bulkPut(lineItems.data.map((r) => ({ ...r, _sync_status: 'synced' as const })) as any);
    }
    if (workLog.data) {
      await db.work_log.bulkPut(workLog.data.map((r) => ({ ...r, _sync_status: 'synced' as const })) as any);
    }
    if (payments.data) {
      await db.payments.bulkPut(payments.data.map((r) => ({ ...r, _sync_status: 'synced' as const })) as any);
    }
  });
}
