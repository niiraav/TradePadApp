import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { db, type Job, type Customer } from '../../lib/db';
import { Button } from '../../components/Button';
import { StickyFooter } from '../../components/StickyFooter';

/* ─── helpers ─── */

function formatAmount(n: number): string {
  return n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ─── types ─── */

interface QuoteSentProps {
  jobId: string;
  sendMethod: 'whatsapp' | 'sms' | 'copy';
  onViewJob: () => void;
  onHome: () => void;
}

/* ─── component ─── */

export default function QuoteSent({ jobId, sendMethod, onViewJob, onHome }: QuoteSentProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const j = await db.jobs.get(jobId);
      if (j) {
        setJob(j);
        const c = await db.customers.get(j.customer_id);
        setCustomer(c || null);
        const items = await db.line_items.where('job_id').equals(jobId).toArray();
        setTotal(items.reduce((sum, i) => sum + i.amount, 0));
      }
      setLoading(false);
    };
    load();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100svh]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!job || !customer) {
    return (
      <div className="flex flex-col min-h-[100svh] items-center justify-center px-4">
        <p className="text-[15px] text-[#9CA3AF]">Quote not found</p>
      </div>
    );
  }

  const methodLabel =
    sendMethod === 'whatsapp' ? 'Via WhatsApp'
    : sendMethod === 'sms' ? 'Via SMS'
    : 'Copied to clipboard';

  const customerFirstName = customer.name.split(' ')[0] || 'there';

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Empty header spacer for alignment */}
      <div className="px-4 pt-2 pb-3 border-b border-[#F3F4F6] shrink-0 flex items-center justify-between opacity-0">
        <div className="min-h-[44px] pr-4 text-[14px] font-medium">&nbsp;</div>
        <div className="text-[16px] font-bold">&nbsp;</div>
        <div className="min-h-[44px] text-[14px]">&nbsp;</div>
      </div>

      {/* Body — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Green check circle */}
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-5">
          <Check size={28} strokeWidth={3} className="text-[#15803D]" />
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-extrabold text-[#111827] mb-2">
          Quote sent
        </h2>

        {/* Details */}
        <p className="text-[15px] text-[#6B7280] leading-relaxed mb-7">
          {customerFirstName} · {job.title}<br />
          £{formatAmount(total)} · {methodLabel}
        </p>

        {/* What happens next card */}
        <div className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-4 mb-7 text-left">
          <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.5px] mb-2">
            What happens next
          </div>
          <div className="text-[13px] text-[#374151] leading-relaxed">
            Job saved under <strong className="text-[#111827]">Quoted</strong> in your Jobs list.
            <br /><br />
            When {customerFirstName} confirms, open the job and tap <strong className="text-[#111827]">Mark as Booked</strong> to move it forward.
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <StickyFooter>
        <Button variant="primary" onClick={onViewJob}>
          View job
        </Button>
        <Button variant="secondary" onClick={onHome}>
          Back to home
        </Button>
      </StickyFooter>
    </div>
  );
}
