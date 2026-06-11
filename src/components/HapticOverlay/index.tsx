import { useRef, useEffect, type ReactNode } from 'react';
import { attachHapticOverlay } from '../../lib/haptics';

interface HapticOverlayProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Wrapper that overlays a hidden iOS switch control for native haptic feedback.
 * On iOS Safari 17.4+, the user's direct tap on the switch triggers a system haptic tick.
 * On Android, this is a no-op wrapper — navigator.vibrate handles haptics elsewhere.
 *
 * Technique: https://github.com/m1ckc3s/project-fathom
 */
export function HapticOverlay({ children, className = '', onClick }: HapticOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = attachHapticOverlay(el);
    return cleanup ?? undefined;
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
