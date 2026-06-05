import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, MessageCircle, Banknote, CreditCard, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { db, type Job, type Customer, type LineItem, type WorkLogEntry } from '../../lib/db';
import { HomeTabSwitcher } from '../../components/HomeTabSwitcher';
import { JobCard } from '../../components/JobCard';
import { ActiveBar } from '../../components/ActiveBar';
import { TodayStrip } from '../../components/TodayStrip';
import { TabBar } from '../../components/TabBar';
import { BottomSheet, SheetRow } from '../../components/BottomSheet';
import { Button } from '../../components/Button';

/* --- helpers --- */

const now = () => new Date().toISOString();

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

function formatAmount(n: number): string {
  return n.toFixed(2);
}

function jobTotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + (i.amount || 0), 0);
}

/* --- types --- */

type Tab = 'today' | 'tasks';

type SheetState =
  | null
  | 'running_late'
  | 'mark_done'
  | 'mark_done_deposit';

/* --- component --- */

export default function Home() {
  const navigate = useNavigate();
  const userId = useAppStore((s) => s.userId);

  /* tabs */
  const [activeTab, setActiveTab] = useState<Tab>('today');

  /* data */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [lineItems, setLineItems] = useState<Record<string, LineItem[]>>({});
  const [workLog, setWorkLog] = useState<Record<string, WorkLogEntry[]>>({});
  const [loading, setLoading] = useState(true);

  /* UI state */
  const [sheet, setSheet] = useState<SheetState>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [lateMsg, setLateMsg] = useState('');
  const [notifiedMap, setNotifiedMap] = useState<Record<string, boolean>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tick, setTick] = useState(0);

  /* --- fetch data --- */
  const refresh = useCallback(async () => {
    if (!userId) return;
    const allJobs = await db.jobs.where('user_id').equals(userId).toArray();
    const allCustomers = await db.customers.where('user_id').equals(userId).toArray();
    const allItems = await db.line_items.toArray();
    const allWorkLog = await db.work_log.toArray();

    const custMap: Record<string, Customer> = {};
    allCustomers.forEach((c) => { custMap[c.id] = c; });

    const itemsMap: Record<string, LineItem[]> = {};
    allItems.forEach((i) => {
      if (!itemsMap[i.job_id]) itemsMap[i.job_id] = [];
      itemsMap[i.job_id].push(i);
    });

    const logMap: Record<string, WorkLogEntry[]> = {};
    allWorkLog.forEach((w) => {
      if (!logMap[w.job_id]) logMap[w.job_id] = [];
      logMap[w.job_id].push(w);
    });

    setJobs(allJobs);
    setCustomers(custMap);
    setLineItems(itemsMap);
    setWorkLog(logMap);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* tick for elapsed timer */
  useEffect(() => {
    timerRef.current = setInterval(() => setTick((t) => t + 1), 60000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* --- derived --- */
  const activeJob = useMemo(
    () => jobs.find((j) => j.status === 'in_progress' && j.user_id === userId),
    [jobs, userId]
  );

  const bookedToday = useMemo(
    () =>
      jobs
        .filter(
          (j) =>
            j.status === 'booked' &&
            j.user_id === userId &&
            j.scheduled_start &&
            isToday(j.scheduled_start)
        )
        .sort(
          (a, b) =>
            new Date(a.scheduled_start!).getTime() - new Date(b.scheduled_start!).getTime()
        ),
    [jobs, userId]
  );

  const nextUpJob = bookedToday[0] || null;
  const remainingTodayJobs = bookedToday.slice(1);

  const todayState = useMemo(() => {
    if (activeJob) return activeJob.is_multi_day ? 'multi_day' : 'in_progress';
    if (nextUpJob) return 'next_up';
    return 'all_clear';
  }, [activeJob, nextUpJob]);

  const activeElapsed = useMemo(() => {
    if (!activeJob?.actual_start) return 0;
    return Math.floor((Date.now() - new Date(activeJob.actual_start).getTime()) / 1000);
  }, [activeJob, tick]);

  const activeDayNumber = useMemo(() => {
    if (!activeJob?.actual_start || !activeJob.is_multi_day) return undefined;
    const start = new Date(activeJob.actual_start);
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  }, [activeJob, tick]);

  /* --- helpers --- */
  const customerFor = (jobId: string) => {
    const j = jobs.find((x) => x.id === jobId);
    return j ? customers[j.customer_id] : undefined;
  };
  const itemsFor = (jobId: string) => lineItems[jobId] || [];
  const totalFor = (jobId: string) => jobTotal(itemsFor(jobId));
  const logFor = (jobId: string) => workLog[jobId] || [];

  /* --- actions --- */

  const handleImHere = async () => {
    if (!nextUpJob || !userId) return;
    const n = now();
    await db.jobs.update(nextUpJob.id, {
      status: 'in_progress',
      actual_start: n,
      updated_at: n,
      _sync_status: 'pending',
    });
    await db.work_log.add({
      id: crypto.randomUUID(),
      job_id: nextUpJob.id,
      type: 'status_change',
      description: 'Job started',
      created_at: n,
      _sync_status: 'pending',
    });
    await db.sync_queue.add({
      operation: 'update',
      table_name: 'jobs',
      record_id: nextUpJob.id,
      payload: { status: 'in_progress', actual_start: n, updated_at: n },
      created_at: n,
      retry_count: 0,
    });
    refresh();
  };

  const handleRunningLate = () => {
    if (!nextUpJob) return;
    const c = customerFor(nextUpJob.id);
    const name = c?.name || 'the customer';
    const time = nextUpJob.scheduled_start
      ? new Date(nextUpJob.scheduled_start).toLocaleTimeString('en-GB', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).toLowerCase()
      : 'soon';
    setLateMsg(
      `Hi ${name}, just a heads up — I'm running a bit late. I should be with you around ${time}. Sorry for any inconvenience!`
    );
    setSelectedJobId(nextUpJob.id);
    setSheet('running_late');
  };

  const handleSendLate = async (method: 'whatsapp' | 'sms') => {
    if (!selectedJobId) return;
    const c = customerFor(selectedJobId);
    if (!c?.phone) return;

    const encoded = encodeURIComponent(lateMsg);
    const url =
      method === 'whatsapp'
        ? `https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encoded}`
        : `sms:${c.phone}?body=${encoded}`;
    window.open(url, '_blank');

    const n = now();
    await db.work_log.add({
      id: crypto.randomUUID(),
      job_id: selectedJobId,
      type: 'customer_notified',
      description: `Customer notified via ${method === 'whatsapp' ? 'WhatsApp' : 'SMS'} · ${new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
      created_at: n,
      _sync_status: 'pending',
    });
    setNotifiedMap((prev) => ({ ...prev, [selectedJobId]: true }));
    setSheet(null);
    refresh();
  };

  const handlePayment = async (method: 'cash' | 'bank_transfer' | 'other' | 'not_yet') => {
    if (!selectedJobId) return;
    const j = jobs.find((x) => x.id === selectedJobId);
    if (!j) return;
    const total = totalFor(selectedJobId);
    const n = now();

    if (method === 'not_yet') {
      await db.jobs.update(selectedJobId, {
        status: 'awaiting_payment',
        actual_end: n,
        updated_at: n,
        _sync_status: 'pending',
      });
      await db.work_log.add({
        id: crypto.randomUUID(),
        job_id: selectedJobId,
        type: 'status_change',
        description: 'Job completed — payment pending',
        created_at: n,
        _sync_status: 'pending',
      });
    } else {
      const paymentType = j.payment_terms === 'deposit' ? 'balance' : 'full';
      const paymentAmount = j.payment_terms === 'deposit'
        ? total - (j.deposit_pct ? (j.deposit_pct / 100) * total : 0)
        : total;

      await db.payments.add({
        id: crypto.randomUUID(),
        job_id: selectedJobId,
        type: paymentType,
        method,
        amount: paymentAmount,
        recorded_at: n,
        created_at: n,
        _sync_status: 'pending',
      });
      await db.jobs.update(selectedJobId, {
        status: 'paid',
        actual_end: n,
        updated_at: n,
        _sync_status: 'pending',
      });
      await db.work_log.add({
        id: crypto.randomUUID(),
        job_id: selectedJobId,
        type: 'status_change',
        description: `Payment recorded — ${method === 'cash' ? 'Cash' : method === 'bank_transfer' ? 'Bank Transfer' : 'Other'} · £${formatAmount(paymentAmount)}`,
        created_at: n,
        _sync_status: 'pending',
      });
    }

    setSheet(null);
    refresh();
  };

  const handleNavigate = (tab: 'home' | 'jobs' | 'settings') => {
    if (tab === 'home') return;
    navigate('/' + tab);
  };

  /* --- render helpers --- */

  const renderNextUpCard = () => {
    if (!nextUpJob) return null;
    const c = customerFor(nextUpJob.id);
    if (!c) return null;
    const total = totalFor(nextUpJob.id);
    const wasNotified = notifiedMap[nextUpJob.id];
    const lastNotify = logFor(nextUpJob.id).filter(
      (w) => w.type === 'customer_notified'
    )[0];
    const showNotify = wasNotified || lastNotify;

    return (
      <div className="px-4 mt-3">
        <JobCard
          job={nextUpJob}
          customer={c}
          lineItemsTotal={total}
          isNextUp={true}
          onRunningLate={handleRunningLate}
          onImHere={handleImHere}
          onBodyTap={() => navigate(`/jobs/${nextUpJob.id}`)}
        />
        {showNotify && (
          <div className="mt-2 flex items-center gap-1.5">
            <Check size={12} strokeWidth={2.5} className="text-[#15803D]" />
            <span className="text-xs text-[#15803D]">
              Customer notified · {lastNotify?.description.split(' · ')[1] || 'just now'}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderActiveBar = () => {
    if (!activeJob) return null;
    const c = customerFor(activeJob.id);
    if (!c) return null;
    return (
      <ActiveBar
        customer={c}
        job={activeJob}
        elapsedSeconds={activeElapsed}
        dayNumber={activeDayNumber}
        onTap={() => navigate(`/jobs/${activeJob.id}`)}
      />
    );
  };

  const renderRemainingStrip = () => {
    if (remainingTodayJobs.length === 0) return null;
    const stripJobs = remainingTodayJobs.map((j) => {
      const c = customerFor(j.id);
      return {
        time: j.scheduled_start
          ? new Date(j.scheduled_start).toLocaleTimeString('en-GB', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }).toLowerCase()
          : '',
        customerName: c?.name || 'Customer',
        jobTitle: j.title,
      };
    });
    return (
      <div className="px-4 mt-3">
        <TodayStrip jobs={stripJobs} onTap={() => navigate('/jobs')} />
      </div>
    );
  };

  const renderNextJobNoCtas = () => {
    if (todayState !== 'in_progress' && todayState !== 'multi_day') return null;
    if (!nextUpJob) return null;
    const c = customerFor(nextUpJob.id);
    if (!c) return null;
    return (
      <div className="px-4 mt-3">
        <JobCard
          job={nextUpJob}
          customer={c}
          lineItemsTotal={totalFor(nextUpJob.id)}
          onBodyTap={() => navigate(`/jobs/${nextUpJob.id}`)}
        />
      </div>
    );
  };

  const renderEmptyToday = () => (
    <div className="px-4 mt-6">
      <div className="border-[2px] border-dashed border-[#E5E7EB] rounded-xl p-8 text-center">
        <p className="text-[15px] font-semibold text-[#9CA3AF]">No jobs today</p>
        <p className="text-[13px] text-[#9CA3AF] mt-1">
          Enjoy the break, or add a new quote.
        </p>
      </div>
      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/quote')} fullWidth>
          + New Quote
        </Button>
      </div>
    </div>
  );

  /* --- selected for sheets --- */
  const selectedCustomer = selectedJobId ? customerFor(selectedJobId) : null;
  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null;

  /* --- main render --- */
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100svh]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100svh] relative">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <span className="text-[20px] font-extrabold text-[#111827]">TradePad</span>
        <button
          onClick={() => navigate('/quote')}
          className="text-[13px] font-semibold text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-2 cursor-pointer"
        >
          + New Quote
        </button>
      </div>

      {/* Tab switcher */}
      <HomeTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      {/* Today tab content */}
      {activeTab === 'today' && (
        <div className="flex-1 pb-4">
          {/* Active bar */}
          {(todayState === 'in_progress' || todayState === 'multi_day') && renderActiveBar()}

          {/* Next Up card */}
          {todayState === 'next_up' && renderNextUpCard()}

          {/* Next job card (no CTAs) when active */}
          {(todayState === 'in_progress' || todayState === 'multi_day') && renderNextJobNoCtas()}

          {/* Remaining today strip */}
          {(todayState === 'next_up' || todayState === 'in_progress' || todayState === 'multi_day') &&
            renderRemainingStrip()}

          {/* All clear / no jobs */}
          {todayState === 'all_clear' && renderEmptyToday()}
        </div>
      )}

      {/* Tasks tab — placeholder */}
      {activeTab === 'tasks' && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[15px] text-[#9CA3AF]">Nothing to do</p>
        </div>
      )}

      {/* FAB: Log missed call (shown in active state) */}
      {(todayState === 'in_progress' || todayState === 'multi_day') && (
        <button
          onClick={() => navigate('/quote')}
          className="absolute bottom-[72px] right-4 w-[52px] h-[52px] rounded-full bg-[#111827] flex items-center justify-center shadow-lg cursor-pointer z-30"
          aria-label="Log missed call"
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </button>
      )}

      {/* Tab bar */}
      <TabBar activeTab="home" onNavigate={handleNavigate} />

      {/* --- Bottom Sheet: Running Late --- */}
      <BottomSheet
        isOpen={sheet === 'running_late'}
        onClose={() => setSheet(null)}
        title={`Let ${selectedCustomer?.name || 'the customer'} know you're running late`}
      >
        <textarea
          value={lateMsg}
          onChange={(e) => setLateMsg(e.target.value)}
          className="w-full min-h-[120px] border border-[#E5E7EB] rounded-xl p-3 text-[15px] text-[#111827] outline-none resize-none mb-4"
          autoFocus
        />
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={() => handleSendLate('whatsapp')}
            fullWidth
          >
            <MessageCircle size={18} className="mr-2" />
            Send via WhatsApp
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSendLate('sms')}
            fullWidth
          >
            Send via SMS
          </Button>
          <Button variant="ghost" onClick={() => setSheet(null)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>

      {/* --- Bottom Sheet: Mark Done (no deposit) --- */}
      <BottomSheet
        isOpen={sheet === 'mark_done'}
        onClose={() => setSheet(null)}
        title="How were you paid?"
        subtitle={
          selectedCustomer && selectedJob
            ? `for ${selectedCustomer.name} · ${selectedJob.title}`
            : undefined
        }
      >
        <div className="flex flex-col">
          <SheetRow
            icon={<Banknote size={18} color="#374151" />}
            label="Cash"
            onTap={() => handlePayment('cash')}
          />
          <SheetRow
            icon={<CreditCard size={18} color="#374151" />}
            label="Bank Transfer"
            onTap={() => handlePayment('bank_transfer')}
          />
          <SheetRow
            icon={<AlertTriangle size={18} color="#374151" />}
            label="Other"
            sublabel="Entered manually"
            onTap={() => handlePayment('other')}
          />
          <SheetRow
            icon={<AlertTriangle size={18} color="#DC2626" />}
            label="Not yet"
            sublabel="Chase later"
            onTap={() => handlePayment('not_yet')}
            variant="destructive"
            isLast
          />
        </div>
      </BottomSheet>

      {/* --- Bottom Sheet: Mark Done (deposit) --- */}
      <BottomSheet
        isOpen={sheet === 'mark_done_deposit'}
        onClose={() => setSheet(null)}
        title="How were you paid?"
        subtitle={
          selectedCustomer && selectedJob
            ? `for ${selectedCustomer.name} · ${selectedJob.title}`
            : undefined
        }
      >
        {selectedJob && (
          <div className="mb-4">
            <div className="bg-[#F9FAFB] rounded-xl p-4 text-center">
              <p className="text-[13px] text-[#6B7280] mb-1">Balance to collect</p>
              <p className="text-[28px] font-extrabold text-[#111827]">
                £{formatAmount(
                  totalFor(selectedJob.id) -
                    (selectedJob.deposit_pct
                      ? (selectedJob.deposit_pct / 100) * totalFor(selectedJob.id)
                      : 0)
                )}
              </p>
              <p className="text-[13px] text-[#9CA3AF] mt-1">
                £{formatAmount(
                  selectedJob.deposit_pct
                    ? (selectedJob.deposit_pct / 100) * totalFor(selectedJob.id)
                    : 0
                )}{' '}
                deposit already paid
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <SheetRow
            icon={<Banknote size={18} color="#374151" />}
            label="Cash"
            onTap={() => handlePayment('cash')}
          />
          <SheetRow
            icon={<AlertTriangle size={18} color="#374151" />}
            label="Other"
            sublabel="Entered manually"
            onTap={() => handlePayment('other')}
          />
          <SheetRow
            icon={<AlertTriangle size={18} color="#DC2626" />}
            label="Not yet"
            sublabel="Chase later"
            onTap={() => handlePayment('not_yet')}
            variant="destructive"
            isLast
          />
        </div>
      </BottomSheet>
    </div>
  );
}
