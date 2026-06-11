import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useAppStore } from '../store/useAppStore';
import { identifyUser, captureUserSignedIn } from '../lib/analytics';
import { showSuccess, showError, showToast } from '../components/Toast/store';
import { haptic, hapticError, hapticSuccess } from '../lib/haptics';
import { Button } from '../components/Button';

type AuthStep = 'phone' | 'otp';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length >= 10 && digits.length <= 11) {
    return '+44' + digits.slice(1);
  }
  if (digits.startsWith('44') && digits.length >= 12) {
    return '+' + digits;
  }
  if (raw.trim().startsWith('+')) {
    return raw.trim();
  }
  if (digits.startsWith('0')) {
    return '+44' + digits.slice(1);
  }
  return '+44' + digits;
}

function displayPhone(formatted: string): string {
  if (formatted.startsWith('+44')) {
    const digits = formatted.slice(3);
    if (digits.length === 10) {
      return '0' + digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7);
    }
    return '0' + digits;
  }
  return formatted;
}

export default function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9+\s]/g, '');
    setPhoneInput(val);
    setError('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setError('');
  };

  const handleSendOtp = async () => {
    if (!phoneInput.trim()) {
      setError('Enter your phone number');
      return;
    }
    const formatted = formatPhone(phoneInput);
    if (!formatted.startsWith('+44') || formatted.length < 12) {
      setError('Enter a valid UK mobile number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatted,
      });
      if (otpError) {
        console.error('[Auth] OTP send error:', otpError);
        hapticError();
        showError(otpError.message || 'Could not send code. Try again.');
        setLoading(false);
        return;
      }
      hapticSuccess();
      showToast(`Code sent to ${displayPhone(formatted)}`, 'info', 3000);
      setStep('otp');
      setCountdown(60);
    } catch (err) {
      console.error('[Auth] Send OTP exception:', err);
      hapticError();
      showError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    const formatted = formatPhone(phoneInput);
    setError('');
    setLoading(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formatted,
        token: otp,
        type: 'sms',
      });
      if (verifyError || !data.session) {
        console.error('[Auth] Verify error:', verifyError);
        hapticError();
        showError(verifyError?.message || 'Invalid code. Try again.');
        setLoading(false);
        return;
      }

      hapticSuccess();
      showSuccess("You're in");
      const userId = data.session.user.id;
      identifyUser(userId, { phone: formatted });
      captureUserSignedIn();

      const profile = await db.profiles.get(userId);
      navigate(profile ? '/' : '/onboarding', { replace: true });
    } catch (err) {
      console.error('[Auth] Verify exception:', err);
      hapticError();
      showError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const formatted = formatPhone(phoneInput);
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatted,
      });
      if (otpError) {
        showError(otpError.message || 'Could not resend code.');
        return;
      }
      hapticSuccess();
      showToast('Code resent', 'info', 2000);
      setCountdown(60);
      setError('');
    } catch (err) {
      showError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  const handleMockSignIn = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('[Auth] Mock sign-in started');
    try {
      try {
        await db.open();
        console.log('[Auth] Dexie DB opened, tables:', db.tables.map(t => t.name).join(', '));
      } catch (dbErr) {
        console.warn('[Auth] Dexie open failed:', dbErr);
      }

      const existingMock = localStorage.getItem('tradepad_mock_user');
      let mockUserId: string;
      let mockPhone: string;

      if (existingMock) {
        try {
          const mock = JSON.parse(existingMock);
          mockUserId = mock.id;
          mockPhone = mock.phone || '07700 900000';
          console.log('[Auth] Reusing existing mock user:', mockUserId);
        } catch {
          mockUserId = 'mock_' + Date.now();
          mockPhone = '07700 900000';
          localStorage.setItem('tradepad_mock_user', JSON.stringify({
            id: mockUserId,
            phone: mockPhone,
            created_at: new Date().toISOString(),
          }));
          console.log('[Auth] Created new mock user (old was corrupted):', mockUserId);
        }
      } else {
        mockUserId = 'mock_' + Date.now();
        mockPhone = '07700 900000';
        localStorage.setItem('tradepad_mock_user', JSON.stringify({
          id: mockUserId,
          phone: mockPhone,
          created_at: new Date().toISOString(),
        }));
        console.log('[Auth] Created new mock user:', mockUserId);
      }

      useAppStore.getState().setUserId(mockUserId);
      console.log('[Auth] Set userId in store:', mockUserId);

      let profile = null;
      try {
        profile = await Promise.race([
          db.profiles.get(mockUserId),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
        ]);
        console.log('[Auth] Profile found:', !!profile);
      } catch (profileErr) {
        console.warn('[Auth] Profile read failed:', profileErr);
      }

      hapticSuccess();
      showToast('Signed in as test user', 'info', 2000);

      if (profile && profile.full_name) {
        console.log('[Auth] Navigating to Home (profile exists)');
        navigate('/', { replace: true });
      } else {
        console.log('[Auth] Navigating to Onboarding (no profile)');
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      console.error('[Auth] Mock sign-in error:', err);
      hapticError();
      showError('Mock sign-in failed');
      setError('Mock sign-in failed: ' + ((err as Error)?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleResetDevData = () => {
    haptic('light');
    localStorage.removeItem('tradepad_mock_user');
    db.delete().then(() => {
      navigate('/auth', { replace: true });
      window.location.reload();
    }).catch(() => {
      navigate('/auth', { replace: true });
      window.location.reload();
    });
  };

  const formattedPhone = formatPhone(phoneInput);
  const displayNumber = displayPhone(formattedPhone);

  return (
    <div className="flex flex-col items-center px-6 pt-12 pb-8 h-full">
      <div className="text-hero font-extrabold text-brand-black mb-8">
        TradePad
      </div>

      <div className="w-full flex flex-col gap-4">
        {step === 'phone' && (
          <>
            <div>
              <h1 className="text-xl font-bold text-brand-black">Get started</h1>
              <p className="text-sm text-brand-muted mt-1">
                We&apos;ll send you a code to verify your number. No password needed.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-label font-bold tracking-[0.4px] text-brand-muted">Mobile Number</label>
              <div className={`flex items-center border-2 rounded-xl min-h-12 overflow-hidden transition-colors ${error ? 'border-red-500' : 'border-brand-border'}`}>
                <span className="text-base text-brand-mid px-4 shrink-0 select-none">🇬🇧 +44</span>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="7700 900000"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  className="flex-1 text-base text-brand-black outline-none min-h-12 px-4 bg-transparent"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-status-red mt-1">{error}</p>}
            </div>

            <div className="mt-2">
              <Button
                variant="primary"
                onClick={handleSendOtp}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Sending code...' : 'Send code'}
              </Button>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div>
              <h1 className="text-xl font-bold text-brand-black">Enter code</h1>
              <p className="text-sm text-brand-muted mt-1">
                We sent a 6-digit code to <span className="font-medium text-brand-black">{displayNumber}</span>
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-label font-bold tracking-[0.4px] text-brand-muted">Verification Code</label>
              <div className={`flex items-center border-2 rounded-xl min-h-12 overflow-hidden transition-colors ${error ? 'border-red-500' : 'border-brand-border'}`}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  className="flex-1 text-base text-brand-black outline-none min-h-12 px-4 bg-transparent tracking-[0.5em] text-center"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-status-red mt-1">{error}</p>}
            </div>

            <div className="mt-2">
              <Button
                variant="primary"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                fullWidth
                hapticPattern="medium"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>

            <div className="text-center mt-2 flex flex-col gap-2">
              <button
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className="text-sm font-medium text-brand-mid min-h-11 px-4 cursor-pointer disabled:opacity-50 active:opacity-70 transition-opacity duration-100"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
              </button>
              <button
                onClick={handleChangeNumber}
                className="text-sm font-medium text-brand-mid min-h-11 px-4 cursor-pointer active:opacity-70 transition-opacity duration-100"
              >
                Change number
              </button>
            </div>
          </>
        )}

        {import.meta.env.DEV && (
          <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-brand-border">
            <p className="text-label font-bold tracking-[0.4px] text-brand-muted text-center">Dev Testing</p>
            <Button
              variant="secondary"
              onClick={handleMockSignIn}
              disabled={loading}
              fullWidth
            >
              Mock Sign In (Test Mode)
            </Button>
            <button
              onClick={() => { haptic('light'); setPhoneInput('07700 900000'); }}
              className="h-11 w-full rounded-lg text-sm font-medium text-brand-mid cursor-pointer bg-transparent active:opacity-70 transition-opacity duration-100"
            >
              Fill Test Number
            </button>
            <button
              onClick={handleResetDevData}
              className="h-11 w-full rounded-lg text-sm font-medium text-status-red cursor-pointer active:opacity-70 transition-opacity duration-100"
            >
              Reset All Local Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
