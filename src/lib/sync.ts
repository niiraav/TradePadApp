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
      await updateSyncStatus(item.table_name, item.record_id, 'synced');
    } catch {
      await db.sync_queue.update(item.id as number, {
        retry_count: item.retry_count + 1,
      });
    }
  }
}

async function pushToSupabase(item: SyncQueueItem) {
  const { operation, table_name, payload } = item;
  const table = supabase.from(table_name);

  if (operation === 'insert') {
    await table.insert(payload);
  } else if (operation === 'update') {
    await table.update(payload).eq('id', item.record_id);
  } else if (operation === 'delete') {
    await table.delete().eq('id', item.record_id);
  }
}

async function updateSyncStatus(tableName: string, recordId: string, status: 'synced' | 'pending' | 'error') {
  switch (tableName) {
    case 'profiles':
      await db.profiles.update(recordId, { _sync_status: status });
      break;
    case 'customers':
      await db.customers.update(recordId, { _sync_status: status });
      break;
    case 'jobs':
      await db.jobs.update(recordId, { _sync_status: status });
      break;
    case 'line_items':
      await db.line_items.update(recordId, { _sync_status: status });
      break;
    case 'work_log':
      await db.work_log.update(recordId, { _sync_status: status });
      break;
    case 'payments':
      await db.payments.update(recordId, { _sync_status: status });
      break;
  }
}
