import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { db } from '../../lib/db';
import LogMissedCall from './LogMissedCall';
import CustomerDetails from './CustomerDetails';
import QuoteBuilder from './QuoteBuilder';
import QuotePreview from './QuotePreview';
import QuoteSent from './QuoteSent';

/* ─── helpers ─── */

function now() { return new Date().toISOString(); }

/* ─── types ─── */

type EntryPoint = 'missed_call' | 'new_quote' | 'task';

type QuoteStep = 'missed_call' | 'customer_details' | 'builder' | 'preview' | 'sent';

type SendMethod = 'whatsapp' | 'sms' | 'copy';

interface LocationState {
  entryPoint?: EntryPoint;
  customerId?: string;
}

/* ─── component ─── */

export default function Quote() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useAppStore((s) => s.userId);

  const state = (location.state as LocationState | null) || {};
  const entryPoint: EntryPoint = state.entryPoint || 'new_quote';
  const initialCustomerId = state.customerId;

  const [step, setStep] = useState<QuoteStep>(
    entryPoint === 'missed_call' ? 'missed_call' : 'customer_details'
  );
  const [customerId, setCustomerId] = useState<string | undefined>(initialCustomerId);
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  const [sendMethod, setSendMethod] = useState<SendMethod | undefined>(undefined);

  /* Save customer data to Dexie (new or update) */
  const saveCustomer = async (data: { id: string; name: string; phone: string; address?: string }) => {
    if (!userId) return;
    const n = now();
    const existing = await db.customers.get(data.id);

    if (existing) {
      await db.customers.update(data.id, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        updated_at: n,
        _sync_status: 'pending',
      });
      await db.sync_queue.add({
        operation: 'update',
        table_name: 'customers',
        record_id: data.id,
        payload: { name: data.name, phone: data.phone, address: data.address, updated_at: n },
        created_at: n,
        retry_count: 0,
      });
    } else {
      await db.customers.add({
        id: data.id,
        user_id: userId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        created_at: n,
        updated_at: n,
        _sync_status: 'pending',
      });
      await db.sync_queue.add({
        operation: 'insert',
        table_name: 'customers',
        record_id: data.id,
        payload: { id: data.id, user_id: userId, name: data.name, phone: data.phone, address: data.address, created_at: n, updated_at: n },
        created_at: n,
        retry_count: 0,
      });
    }
  };

  /* ─── handlers ─── */

  const handleMissedCallDone = () => {
    navigate('/', { replace: true, state: { initialTab: 'tasks' } });
  };

  const handleCustomerDetailsComplete = async (data: { id: string; name: string; phone: string; address?: string }) => {
    await saveCustomer(data);
    setCustomerId(data.id);

    // Find existing job for this customer in enquiry status
    if (userId) {
      const existingJobs = await db.jobs
        .where('customer_id').equals(data.id)
        .and(j => j.status === 'enquiry')
        .toArray();

      if (existingJobs.length > 0) {
        setJobId(existingJobs[0].id);
      } else {
        // Create new job
        const newJobId = crypto.randomUUID();
        const n = now();
        await db.jobs.add({
          id: newJobId,
          user_id: userId,
          customer_id: data.id,
          title: '',
          status: 'enquiry',
          payment_terms: 'on_completion',
          is_multi_day: false,
          created_at: n,
          updated_at: n,
          _sync_status: 'pending',
        });
        await db.sync_queue.add({
          operation: 'insert',
          table_name: 'jobs',
          record_id: newJobId,
          payload: {
            id: newJobId, user_id: userId, customer_id: data.id,
            title: '', status: 'enquiry', payment_terms: 'on_completion',
            is_multi_day: false, created_at: n, updated_at: n,
          },
          created_at: n,
          retry_count: 0,
        });
        setJobId(newJobId);
      }
    }

    setStep('builder');
  };

  const handleBuilderPreview = () => {
    setStep('preview');
  };

  const handlePreviewBack = () => {
    setStep('builder');
  };

  const handlePreviewSend = async (method: SendMethod) => {
    if (!jobId || !userId) return;
    const n = now();

    // Update job to quoted
    await db.jobs.update(jobId, {
      status: 'quoted',
      quote_sent_at: n,
      quote_send_method: method,
      updated_at: n,
      _sync_status: 'pending',
    });

    // Write work log
    await db.work_log.add({
      id: crypto.randomUUID(),
      job_id: jobId,
      type: 'status_change',
      description: `Quote sent via ${method === 'whatsapp' ? 'WhatsApp' : method === 'sms' ? 'SMS' : 'Copy'}`,
      created_at: n,
      _sync_status: 'pending',
    });

    // Sync queue entries
    await db.sync_queue.add({
      operation: 'update',
      table_name: 'jobs',
      record_id: jobId,
      payload: { status: 'quoted', quote_sent_at: n, quote_send_method: method, updated_at: n },
      created_at: n,
      retry_count: 0,
    });

    await db.sync_queue.add({
      operation: 'insert',
      table_name: 'work_log',
      record_id: crypto.randomUUID(),
      payload: { id: crypto.randomUUID(), job_id: jobId, type: 'status_change', description: `Quote sent via ${method === 'whatsapp' ? 'WhatsApp' : method === 'sms' ? 'SMS' : 'Copy'}`, created_at: n },
      created_at: n,
      retry_count: 0,
    });

    setSendMethod(method);
    setStep('sent');
  };

  const handlePreviewSaveDraft = () => {
    // Job stays in 'enquiry' status — no changes needed
    navigate('/', { replace: true });
  };

  const handleSentViewJob = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSentHome = () => {
    navigate('/', { replace: true });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  /* ─── render ─── */

  switch (step) {
    case 'missed_call':
      return <LogMissedCall onDone={handleMissedCallDone} />;

    case 'customer_details':
      return (
        <CustomerDetails
          customerId={customerId}
          onComplete={handleCustomerDetailsComplete}
          onCancel={handleCancel}
        />
      );

    case 'builder':
      if (!customerId) return null;
      return (
        <QuoteBuilder
          customerId={customerId}
          jobId={jobId}
          onPreview={handleBuilderPreview}
          onBack={() => setStep('customer_details')}
          onCancel={handleCancel}
        />
      );

    case 'preview':
      if (!jobId) return null;
      return (
        <QuotePreview
          jobId={jobId}
          onSend={handlePreviewSend}
          onSaveDraft={handlePreviewSaveDraft}
          onBack={handlePreviewBack}
        />
      );

    case 'sent':
      if (!jobId || !sendMethod) return null;
      return (
        <QuoteSent
          jobId={jobId}
          sendMethod={sendMethod}
          onViewJob={handleSentViewJob}
          onHome={handleSentHome}
        />
      );

    default:
      return null;
  }
}
