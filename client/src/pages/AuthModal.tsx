import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { AuthService } from '../services/auth.service.js';
import { DTU_BRANCHES, DTU_HOSTELS, DTU_YEARS } from '../utils/constants.js';

type OnboardingStep = 'EMAIL_INPUT' | 'OTP_INPUT' | 'OTP_SUCCESS' | 'IDENTITY' | 'CONFIRMATION';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login } = useAuth();

  // Flow Steps:
  // Step 1: EMAIL_INPUT (Stage A) ➔ OTP_INPUT (Stage B) ➔ OTP_SUCCESS (Stage C)
  // Step 2: IDENTITY (Consolidated Campus Profile)
  // Step 3: CONFIRMATION (Success profile card)
  const [step, setStep] = useState<OnboardingStep>('EMAIL_INPUT');

  // Input states
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [otpStatus, setOtpStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [isShaking, setIsShaking] = useState(false);

  // Authenticated Token & User Session
  const [session, setSession] = useState<{ token: string; user: any } | null>(null);

  // Step 2: Campus Identity States
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(DTU_BRANCHES[0]);
  const [year, setYear] = useState(DTU_YEARS[1]); // 2nd Year default
  const [residenceType, setResidenceType] = useState<'HOSTELER' | 'DAY_SCHOLAR'>('HOSTELER');
  const [hostel, setHostel] = useState(DTU_HOSTELS[0]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [debugOtpCode, setDebugOtpCode] = useState<string | null>(null);

  // OTP Input Refs for auto-focus navigation
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const resetAll = () => {
    setStep('EMAIL_INPUT');
    setEmail('');
    setOtpDigits(['', '', '', '']);
    setOtpStatus('IDLE');
    setIsShaking(false);
    setName('');
    setSession(null);
    setError(null);
    setResendSuccess(false);
    setDebugOtpCode(null);
  };

  const handleClose = () => {
    resetAll();
    closeAuthModal();
  };

  // Focus 1st box when OTP stage starts
  useEffect(() => {
    if (step === 'OTP_INPUT') {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 150);
    }
  }, [step]);

  // =========================================================================
  // STEP 1 — STAGE A: Send Code
  // =========================================================================
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setResendSuccess(false);
    setDebugOtpCode(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.requestOtp(cleanEmail, authModalMode);
      if (res.success) {
        setOtpDigits(['', '', '', '']);
        setOtpStatus('IDLE');
        setStep('OTP_INPUT');
        setResendSuccess(true);
        if (res.debugOtp) {
          setDebugOtpCode(res.debugOtp);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // STEP 1 — STAGE B: OTP Input Navigation & Verification
  // =========================================================================
  const handleOtpChange = (index: number, value: string) => {
    setError(null);
    // Allow only numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const char = cleaned.slice(-1); // Single character
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto-advance focus to next box
    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }

    // If all 4 digits filled, automatically verify
    const fullCode = newDigits.join('');
    if (fullCode.length === 4) {
      triggerVerify(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move focus back
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        otpInputRefs[index - 1].current?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    if (pastedData.length === 4) {
      triggerVerify(pastedData);
    } else {
      otpInputRefs[Math.min(pastedData.length, 3)].current?.focus();
    }
  };

  const triggerVerify = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await AuthService.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: code,
      });

      if (res.success && res.token && res.user) {
        // Correct code entered: Green border + green glow
        setOtpStatus('CORRECT');

        const isFreshUser =
          res.isNewUser ||
          !res.user.name ||
          res.user.name === email.split('@')[0] ||
          res.user.name === email.split('@')[0].toUpperCase();

        setSession({ token: res.token, user: res.user });
        if (res.user.name && res.user.name !== email.split('@')[0]) {
          setName(res.user.name);
        }

        // Transition after ~450ms to Stage C (Success)
        setTimeout(() => {
          setStep('OTP_SUCCESS');

          // Stage C: auto-advance to main onboarding after ~1.3s
          setTimeout(() => {
            if (isFreshUser) {
              setStep('IDENTITY');
            } else {
              // Returning user: show confirmation summary card
              setStep('CONFIRMATION');
            }
          }, 1300);
        }, 450);
      } else {
        triggerWrongOtp('Invalid verification code.');
      }
    } catch (err: any) {
      triggerWrongOtp(err.response?.data?.message || err.message || 'Incorrect verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerWrongOtp = (errMsg: string) => {
    setOtpStatus('WRONG');
    setIsShaking(true);

    // Shake for ~380ms, then clear boxes and refocus first box
    setTimeout(() => {
      setIsShaking(false);
      setOtpDigits(['', '', '', '']);
      setOtpStatus('IDLE');
      setError(errMsg);
      otpInputRefs[0].current?.focus();
    }, 380);
  };

  // =========================================================================
  // STEP 2: Finish Campus Identity Setup
  // =========================================================================
  const handleFinishSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!session) {
      setError('Session expired. Please verify your email again.');
      setStep('EMAIL_INPUT');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.updateProfile({
        name: cleanName,
        branch,
        year,
        userType: residenceType,
        hostel: residenceType === 'HOSTELER' ? hostel : undefined,
      });

      const updatedUser = res.success && res.data ? res.data : {
        ...session.user,
        name: cleanName,
        branch,
        year,
        userType: residenceType,
        hostel: residenceType === 'HOSTELER' ? hostel : null,
      };

      setSession({ token: session.token, user: updatedUser });
      // Transition to Step 3: Confirmation
      setStep('CONFIRMATION');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save campus profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // STEP 3: Enter DTU Bazaar
  // =========================================================================
  const handleEnterApp = () => {
    if (session) {
      login(session.token, session.user);
    }
    handleClose();
  };

  if (!isAuthModalOpen) return null;

  // Extract initial for Step 3 avatar
  const userInitial = (name.trim() || session?.user?.name || email || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dim Overlay Background with Dual Ambient Radial-Gradient Glows */}
      <div
        className="fixed inset-0 bg-[#0B0D12]/90 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 12%, rgba(232, 162, 61, 0.13) 0%, transparent 42%),
            radial-gradient(circle at 88% 10%, rgba(52, 211, 153, 0.12) 0%, transparent 42%)
          `,
        }}
      />

      {/* Floating Glassmorphic Container Card */}
      <div
        className={`relative z-10 w-full max-w-[440px] text-[#EDEFF3] transition-all duration-300 ${
          isShaking ? 'animate-shake' : ''
        }`}
        style={{
          background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.03))',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '22px',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          padding: '30px 26px 26px',
        }}
      >
        {/* Subtle Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8A93A3] hover:text-[#EDEFF3] hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* ===================================================================
            STEP 1 — STAGE A: EMAIL VERIFICATION
            =================================================================== */}
        {step === 'EMAIL_INPUT' && (
          <div>
            <div className="mb-6">
              <h2
                className="text-[22px] font-bold text-[#EDEFF3] tracking-tight leading-snug"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Verify your college email
              </h2>
              <p
                className="text-xs text-[#8A93A3] mt-1.5 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Enter your university or personal email to receive a 4-digit verification code.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-4 p-3 rounded-[12px] text-xs flex items-center gap-2 font-medium"
                style={{
                  background: 'rgba(255, 92, 92, 0.12)',
                  border: '1px solid #FF5C5C',
                  color: '#FF5C5C',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  College email address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-[#8A93A3] pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com or roll@dtu.ac.in"
                    autoFocus
                    required
                    className="w-full text-sm placeholder-[#5A6270] rounded-[12px] pl-10 pr-4 py-3 outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      color: '#EDEFF3',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.border = '2px solid #E8A23D')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)')}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 font-semibold text-sm rounded-[9px] transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
                  style={{
                    backgroundColor: '#E8A23D',
                    color: '#241705',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>{isLoading ? 'Sending code...' : 'Send code'}</span>
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#8A93A3]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Verified peer-to-peer campus marketplace. 0% brokerage.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            STEP 1 — STAGE B: 4-DIGIT OTP INPUT
            =================================================================== */}
        {step === 'OTP_INPUT' && (
          <div>
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep('EMAIL_INPUT');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#8A93A3] hover:text-[#EDEFF3] transition-colors mb-2.5 font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <ArrowLeft size={14} />
                <span>Change email</span>
              </button>

              <h2
                className="text-[22px] font-bold text-[#EDEFF3] tracking-tight leading-snug"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Enter the code
              </h2>
              <p
                className="text-xs text-[#8A93A3] mt-1.5 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                We sent a 4-digit code to{' '}
                <span className="text-[#EDEFF3] font-semibold">{email}</span>
              </p>
            </div>

            {/* Test OTP Hint if available */}
            {debugOtpCode && (
              <div
                className="mb-4 p-2.5 rounded-[12px] text-xs flex items-center justify-between"
                style={{
                  background: 'rgba(232, 162, 61, 0.10)',
                  border: '1px solid rgba(232, 162, 61, 0.35)',
                  color: '#E8A23D',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <span>Fast login code: <strong>{debugOtpCode}</strong> (or universal code 1234)</span>
                <button
                  type="button"
                  onClick={() => {
                    const code = debugOtpCode.slice(0, 4);
                    const newDigits = code.split('');
                    setOtpDigits(newDigits);
                    triggerVerify(code);
                  }}
                  className="px-2 py-0.5 rounded-[6px] bg-[#E8A23D] text-[#241705] font-bold text-[10.5px]"
                >
                  Autofill
                </button>
              </div>
            )}

            {/* 4 Separate Single-Digit OTP Boxes (52x58px, 12px radius, glass style) */}
            <div className="flex items-center justify-center gap-3 my-6">
              {otpDigits.map((digit, idx) => {
                // Dynamic border & glow based on verification state
                let boxBorder = '1px solid rgba(255, 255, 255, 0.16)';
                let boxGlow = 'none';
                let textColor = '#EDEFF3';

                if (otpStatus === 'CORRECT') {
                  boxBorder = '1px solid #34D399';
                  boxGlow = '0 0 22px rgba(52, 211, 153, 0.65)';
                  textColor = '#34D399';
                } else if (otpStatus === 'WRONG') {
                  boxBorder = '1px solid #FF5C5C';
                  boxGlow = '0 0 22px rgba(255, 92, 92, 0.55)';
                  textColor = '#FF5C5C';
                }

                return (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    disabled={isLoading || otpStatus === 'CORRECT'}
                    className="w-[52px] h-[58px] text-center text-2xl font-bold rounded-[12px] outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: boxBorder,
                      boxShadow: boxGlow,
                      color: textColor,
                      fontFamily: "'Sora', monospace",
                    }}
                    onFocus={(e) => {
                      if (otpStatus === 'IDLE') {
                        e.currentTarget.style.border = '2px solid #E8A23D';
                      }
                    }}
                    onBlur={(e) => {
                      if (otpStatus === 'IDLE') {
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)';
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-4 p-3 rounded-[12px] text-xs flex items-center justify-center gap-2 font-medium"
                style={{
                  background: 'rgba(255, 92, 92, 0.12)',
                  border: '1px solid #FF5C5C',
                  color: '#FF5C5C',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend Action */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-[#8A93A3]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Didn't receive code?
              </span>
              <button
                type="button"
                onClick={() => handleSendCode()}
                disabled={isLoading}
                className="font-medium text-[#E8A23D] hover:underline flex items-center gap-1.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>Resend code</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 1 — STAGE C: VERIFIED SUCCESS (Tile 74x74, 18px radius)
            =================================================================== */}
        {step === 'OTP_SUCCESS' && (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div
              className="w-[74px] h-[74px] rounded-[18px] flex items-center justify-center mb-5 transition-transform duration-300 scale-110"
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid #34D399',
                boxShadow: '0 0 28px rgba(52, 211, 153, 0.45)',
              }}
            >
              <Check size={36} className="text-[#34D399] stroke-[3]" />
            </div>

            <h2
              className="text-[22px] font-bold text-[#EDEFF3] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Verified successfully
            </h2>
            <p
              className="text-xs text-[#8A93A3] mt-2 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Your college email has been verified. Preparing campus setup...
            </p>
          </div>
        )}

        {/* ===================================================================
            STEP 2 — CAMPUS IDENTITY (Consolidated Single Glass Card)
            =================================================================== */}
        {step === 'IDENTITY' && (
          <div>
            <div className="mb-5">
              <h2
                className="text-[22px] font-bold text-[#EDEFF3] tracking-tight leading-snug"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Campus identity
              </h2>
              <p
                className="text-xs text-[#8A93A3] mt-1 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Set up your student profile to trade and connect with peers.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div
                className="mb-4 p-3 rounded-[12px] text-xs flex items-center gap-2 font-medium"
                style={{
                  background: 'rgba(255, 92, 92, 0.12)',
                  border: '1px solid #FF5C5C',
                  color: '#FF5C5C',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFinishSetup} className="space-y-4">
              {/* 1. Full name */}
              <div>
                <label
                  className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  autoFocus
                  required
                  className="w-full text-sm placeholder-[#5A6270] rounded-[12px] px-3.5 py-2.5 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#EDEFF3',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = '2px solid #E8A23D')}
                  onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)')}
                />
              </div>

              {/* 2. Branch / course */}
              <div>
                <label
                  className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Branch / course
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs rounded-[12px] px-3.5 py-2.5 outline-none transition-all cursor-pointer"
                  style={{
                    background: '#141821',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#EDEFF3',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = '2px solid #E8A23D')}
                  onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)')}
                >
                  {DTU_BRANCHES.map((b, i) => (
                    <option key={i} value={b} style={{ background: '#141821', color: '#EDEFF3' }}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Academic year */}
              <div>
                <label
                  className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Academic year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs rounded-[12px] px-3.5 py-2.5 outline-none transition-all cursor-pointer"
                  style={{
                    background: '#141821',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#EDEFF3',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = '2px solid #E8A23D')}
                  onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)')}
                >
                  {DTU_YEARS.map((y, i) => (
                    <option key={i} value={y} style={{ background: '#141821', color: '#EDEFF3' }}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Residence type — Two-option toggle */}
              <div>
                <label
                  className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Residence type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResidenceType('HOSTELER')}
                    className="py-2.5 px-3 rounded-[9px] text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background:
                        residenceType === 'HOSTELER'
                          ? 'rgba(232, 162, 61, 0.12)'
                          : 'rgba(255, 255, 255, 0.06)',
                      border:
                        residenceType === 'HOSTELER'
                          ? '1px solid #E8A23D'
                          : '1px solid rgba(255, 255, 255, 0.14)',
                      color: residenceType === 'HOSTELER' ? '#E8A23D' : '#8A93A3',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span>🏢 Hosteler</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResidenceType('DAY_SCHOLAR')}
                    className="py-2.5 px-3 rounded-[9px] text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background:
                        residenceType === 'DAY_SCHOLAR'
                          ? 'rgba(232, 162, 61, 0.12)'
                          : 'rgba(255, 255, 255, 0.06)',
                      border:
                        residenceType === 'DAY_SCHOLAR'
                          ? '1px solid #E8A23D'
                          : '1px solid rgba(255, 255, 255, 0.14)',
                      color: residenceType === 'DAY_SCHOLAR' ? '#E8A23D' : '#8A93A3',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span>🚗 Day scholar</span>
                  </button>
                </div>
              </div>

              {/* 5. Hostel selection — Only visible when Hosteler is selected */}
              {residenceType === 'HOSTELER' && (
                <div>
                  <label
                    className="block text-xs font-medium text-[#8A93A3] mb-1.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Hostel name
                  </label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full text-xs rounded-[12px] px-3.5 py-2.5 outline-none transition-all cursor-pointer"
                    style={{
                      background: '#141821',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      color: '#EDEFF3',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.border = '2px solid #E8A23D')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.16)')}
                  >
                    {DTU_HOSTELS.map((h, i) => (
                      <option key={i} value={h} style={{ background: '#141821', color: '#EDEFF3' }}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Single Finish setup button at bottom */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 font-semibold text-sm rounded-[9px] transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
                  style={{
                    backgroundColor: '#E8A23D',
                    color: '#241705',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>{isLoading ? 'Saving profile...' : 'Finish setup'}</span>
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            STEP 3 — CONFIRMATION (Centered Glass Card)
            =================================================================== */}
        {step === 'CONFIRMATION' && (
          <div className="py-2 flex flex-col items-center text-center">
            {/* Small square avatar tile showing initial in green */}
            <div
              className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center mb-4 text-2xl font-bold"
              style={{
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid #34D399',
                color: '#34D399',
                boxShadow: '0 0 20px rgba(52, 211, 153, 0.25)',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {userInitial}
            </div>

            {/* Full name as heading */}
            <h2
              className="text-xl font-bold text-[#EDEFF3] tracking-tight leading-snug"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {name || session?.user?.name || 'DTU Student'}
            </h2>

            {/* Branch + Year as one line (muted/secondary color) */}
            <p
              className="text-xs text-[#8A93A3] mt-1 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {branch} • {year}
            </p>

            {/* Hostel name (or "Day scholar") as second line, more muted */}
            <p
              className="text-[11px] text-[#6B7688] mt-0.5 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {residenceType === 'HOSTELER' ? `🏢 ${hostel}` : '🚗 Day scholar'}
            </p>

            {/* Reassurance note line */}
            <p
              className="text-xs text-[#8A93A3] mt-5 mb-6 px-2 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Your campus profile is ready. You can now browse verified listings, message campus peers, and post items with 0% brokerage.
            </p>

            {/* Enter DTU Bazaar primary button */}
            <button
              type="button"
              onClick={handleEnterApp}
              className="w-full py-3 px-4 font-semibold text-sm rounded-[9px] transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99]"
              style={{
                backgroundColor: '#E8A23D',
                color: '#241705',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span>Enter DTU Bazaar</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
