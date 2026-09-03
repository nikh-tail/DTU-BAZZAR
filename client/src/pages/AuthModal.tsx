import React, { useState } from 'react';
import {
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  User as UserIcon,
  GraduationCap,
  Calendar,
  Building2,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../components/common/Modal.js';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../context/AuthContext.js';
import { AuthService } from '../services/auth.service.js';
import { DTU_BRANCHES, DTU_HOSTELS, DTU_YEARS } from '../utils/constants.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login } = useAuth();

  // 3-Step Flow: EMAIL ➔ OTP ➔ PROFILE (if new user)
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'PROFILE'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authenticatedSession, setAuthenticatedSession] = useState<{ token: string; user: any } | null>(null);

  // Profile Onboarding Fields
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(DTU_BRANCHES[0]);
  const [year, setYear] = useState(DTU_YEARS[1]);
  const [userType, setUserType] = useState<'HOSTELER' | 'DAY_SCHOLAR'>('HOSTELER');
  const [hostel, setHostel] = useState(DTU_HOSTELS[0]);
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const resetForm = () => {
    setStep('EMAIL');
    setEmail('');
    setOtp('');
    setName('');
    setAuthenticatedSession(null);
    setError(null);
    setResendSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    closeAuthModal();
  };

  // 1. Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setResendSuccess(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.requestOtp(cleanEmail, authModalMode);
      if (res.success) {
        setOtp('');
        setStep('OTP');
        setResendSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const submitOtp = otp.trim();
    if (submitOtp.length !== 6) {
      setError('Please enter the 6-digit verification code from your email.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.verifyOtp({
        email: email.trim().toLowerCase(),
        otp: submitOtp,
      });

      if (res.success && res.token && res.user) {
        // Check if user is a brand new user or hasn't finished profile setup
        const isFreshUser =
          res.isNewUser ||
          !res.user.name ||
          res.user.name === email.split('@')[0] ||
          res.user.name === email.split('@')[0].toUpperCase();

        if (isFreshUser) {
          // Store session & transition to Step 3: Profile Creation
          setAuthenticatedSession({ token: res.token, user: res.user });
          setStep('PROFILE');
        } else {
          // Returning user: Log in instantly & close modal
          login(res.token, res.user);
          handleModalClose();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Verification failed. Incorrect OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Step 3: Complete Student Profile
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!authenticatedSession) {
      setError('Session expired. Please verify your email again.');
      setStep('EMAIL');
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.updateProfile({
        name: name.trim(),
        branch,
        year,
        userType,
        hostel: userType === 'HOSTELER' ? hostel : undefined,
        phone: phone.trim() || undefined,
      });

      if (res.success && res.data) {
        login(authenticatedSession.token, res.data);
        handleModalClose();
      } else {
        // Fallback login with existing user data
        login(authenticatedSession.token, {
          ...authenticatedSession.user,
          name: name.trim(),
          branch,
          year,
          userType,
          hostel: userType === 'HOSTELER' ? hostel : null,
          phone: phone.trim() || null,
        });
        handleModalClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleModalClose}
      title={
        step === 'EMAIL'
          ? 'Welcome to DTU Bazaar'
          : step === 'OTP'
          ? 'Check Your Inbox'
          : 'Complete Your Student Profile'
      }
      subtitle={
        step === 'EMAIL'
          ? 'Enter your Gmail or DTU student email to get started'
          : step === 'OTP'
          ? `We sent a 6-digit verification code to ${email}`
          : 'Set up your campus profile to buy, sell, and message DTU peers'
      }
      maxWidth="md"
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resend Success Banner */}
      {resendSuccess && step === 'OTP' && (
        <div className="mb-4 p-3 rounded-2xl bg-lime-50 border border-lime-200 text-lime-900 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>Verification email dispatched! Check your inbox & Spam folder.</span>
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === 'EMAIL' && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com or @dtu.ac.in"
                className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all font-medium"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>We'll send a 6-digit verification code to this inbox.</span>
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="lime"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-glow font-black text-base py-3.5 text-slate-950"
              rightIcon={<ArrowRight size={18} />}
            >
              Send Verification Code
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Verified for all DTU students, hostellers & day scholars. Zero brokerage.
            </p>
          </div>
        </form>
      )}

      {/* STEP 2: Enter 6-Digit OTP */}
      {step === 'OTP' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep('EMAIL');
                }}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors font-bold"
              >
                <ArrowLeft size={14} />
                <span>Change Email</span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestOtp()}
                disabled={isLoading}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>Resend Code</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <KeyRound size={20} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-campus-lime text-slate-950 placeholder-slate-300 rounded-2xl pl-11 pr-4 py-3.5 text-3xl font-mono font-black tracking-[0.4em] outline-none transition-all text-center shadow-inner"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-2 font-medium">
              Check your inbox and spam folder for the 6-digit code.
            </p>
          </div>

          <Button
            type="submit"
            variant="lime"
            size="lg"
            isLoading={isLoading}
            className="w-full shadow-glow font-black text-base py-3.5 text-slate-950"
            rightIcon={<ArrowRight size={18} />}
          >
            Verify & Continue
          </Button>
        </form>
      )}

      {/* STEP 3: Complete Student Profile Setup (New User) */}
      {step === 'PROFILE' && (
        <form onSubmit={handleCompleteProfile} className="space-y-4">
          <div className="p-3 rounded-2xl bg-lime-50 border border-lime-200 flex items-center gap-2.5 text-xs text-lime-900 font-semibold">
            <Sparkles size={18} className="flex-shrink-0 text-emerald-600" />
            <span><strong>Email Verified!</strong> Complete your DTU student profile to finish setup.</span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <UserIcon size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all font-medium"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Branch & Year Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Branch / Major
              </label>
              <div className="relative flex items-center">
                <GraduationCap size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-2.5 py-2.5 text-xs focus:border-campus-lime outline-none font-medium"
                >
                  {DTU_BRANCHES.map((b, i) => (
                    <option key={i} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Year of Study
              </label>
              <div className="relative flex items-center">
                <Calendar size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-2.5 py-2.5 text-xs focus:border-campus-lime outline-none font-medium"
                >
                  {DTU_YEARS.map((y, i) => (
                    <option key={i} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Residency Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Campus Residence Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('HOSTELER')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userType === 'HOSTELER'
                    ? 'bg-lime-100 border-lime-300 text-slate-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>🏢 Hosteler</span>
              </button>

              <button
                type="button"
                onClick={() => setUserType('DAY_SCHOLAR')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userType === 'DAY_SCHOLAR'
                    ? 'bg-lime-100 border-lime-300 text-slate-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>🏠 Day Scholar</span>
              </button>
            </div>
          </div>

          {/* Hostel Name (Only for Hosteler) */}
          {userType === 'HOSTELER' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hostel Name
              </label>
              <div className="relative flex items-center">
                <Building2 size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-2.5 py-2.5 text-xs focus:border-campus-lime outline-none font-medium"
                >
                  {DTU_HOSTELS.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Optional Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WhatsApp / Phone <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <Phone size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 focus:border-campus-lime text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="lime"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-glow font-black text-sm py-3.5 text-slate-950"
              rightIcon={<ArrowRight size={18} />}
            >
              Complete Setup & Enter DTU Bazaar 🚀
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
