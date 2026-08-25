import React, { useState } from 'react';
import { Mail, KeyRound, ShieldCheck, User as UserIcon, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Modal } from '../components/common/Modal.js';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../context/AuthContext.js';
import { AuthService } from '../services/auth.service.js';
import { DTU_BRANCHES, DTU_HOSTELS, DTU_YEARS } from '../utils/constants.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login } = useAuth();

  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(DTU_BRANCHES[0]);
  const [year, setYear] = useState(DTU_YEARS[1]);
  const [userType, setUserType] = useState<'HOSTELER' | 'DAY_SCHOLAR'>('HOSTELER');
  const [hostel, setHostel] = useState(DTU_HOSTELS[0]);
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  const resetForm = () => {
    setStep('EMAIL');
    setEmail('');
    setOtp('');
    setName('');
    setError(null);
    setDebugOtp(null);
  };

  const handleModalClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.requestOtp(cleanEmail, authModalMode);
      if (res.success) {
        if (res.debugOtp) {
          setDebugOtp(res.debugOtp);
          setOtp(res.debugOtp); // Automatically autofill for instant testing!
        }
        setStep('OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        name: name.trim() || undefined,
        branch,
        year,
        userType,
        hostel,
        phone: phone.trim() || undefined,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        resetForm();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Verification failed. Incorrect OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleModalClose}
      title={step === 'EMAIL' ? 'Student & Peer Login' : 'Enter 6-Digit Verification Code'}
      subtitle={
        step === 'EMAIL'
          ? 'Enter your email address (Gmail, DTU email, etc.) to receive an instant OTP'
          : `We sent a one-time code to ${email}`
      }
      maxWidth="md"
    >
      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Dev OTP Helper Banner (Clickable to Autofill) */}
      {debugOtp && (
        <div
          onClick={() => setOtp(debugOtp)}
          className="mb-4 p-3.5 rounded-2xl bg-campus-lime/15 border border-campus-lime/40 text-campus-lime text-xs flex items-center justify-between cursor-pointer hover:bg-campus-lime/25 transition-all shadow-glow select-none"
          title="Click to autofill OTP"
        >
          <span className="font-semibold flex items-center gap-1.5">
            <span>⚡ Dev Mode OTP:</span>
            <span className="text-[10px] text-slate-300 font-normal">(Click to Autofill)</span>
          </span>
          <span className="font-mono font-black text-base tracking-widest px-3 py-1 rounded-xl bg-campus-lime text-black shadow-sm">
            {debugOtp}
          </span>
        </div>
      )}

      {step === 'EMAIL' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address (Gmail / DTU / Any)
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com or 21co101@dtu.ac.in"
                className="w-full bg-slate-900 border border-slate-800 focus:border-campus-lime text-white placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <ShieldCheck size={12} className="text-campus-lime" />
              <span>We'll send a 6-digit verification OTP to your email inbox.</span>
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="lime"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-glow font-bold text-base"
              rightIcon={<ArrowRight size={18} />}
            >
              Send Verification OTP
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              By continuing, you agree to DTU Bazaar's campus community honor code and safety guidelines.
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                6-Digit OTP Code *
              </label>
              {debugOtp && (
                <button
                  type="button"
                  onClick={() => setOtp(debugOtp)}
                  className="text-[11px] font-bold text-campus-lime hover:underline"
                >
                  Fill Code ({debugOtp})
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <KeyRound size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-campus-lime text-campus-lime placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3 text-2xl font-mono font-bold tracking-[0.35em] outline-none transition-all text-center shadow-inner"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Student Profile Quick Onboarding Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Student Profile (First Time Setup)
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:border-campus-lime outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs focus:border-campus-lime outline-none"
                >
                  {DTU_BRANCHES.map((b, i) => (
                    <option key={i} value={b}>
                      {b.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs focus:border-campus-lime outline-none"
                >
                  {DTU_YEARS.map((y, i) => (
                    <option key={i} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hostel / Residence
              </label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs focus:border-campus-lime outline-none"
              >
                {DTU_HOSTELS.map((h, i) => (
                  <option key={i} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setStep('EMAIL')}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="lime"
              size="lg"
              isLoading={isLoading}
              className="flex-1 shadow-glow font-bold"
              leftIcon={<CheckCircle2 size={16} />}
            >
              Verify & Enter DTU Bazaar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
