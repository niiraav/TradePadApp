import { useState } from 'react';
import { X } from 'lucide-react';

export default function DesktopNudge() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tp_desktop_nudge_dismissed') === '1';
    }
    return false;
  });

  if (typeof window !== 'undefined' && window.innerWidth <= 768) return null;
  if (dismissed) return null;

  return (
    <div
      style={{
        background: '#111827',
        color: '#fff',
        padding: '12px 16px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span>TradePad is designed for your phone — for the best experience, open it on mobile.</span>
      <button
        onClick={() => {
          localStorage.setItem('tp_desktop_nudge_dismissed', '1');
          setDismissed(true);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#9CA3AF',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          minWidth: '28px',
          minHeight: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        aria-label="Dismiss desktop nudge"
      >
        <X size={18} />
      </button>
    </div>
  );
}
