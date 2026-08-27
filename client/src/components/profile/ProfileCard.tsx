import React, { useState } from 'react';
import { User as UserIcon, Edit2, ShieldCheck, Star, MapPin, Building, GraduationCap, Phone, Mail, Check, Zap, Sparkles } from 'lucide-react';
import { User } from '../../types/index.js';
import { DTU_BRANCHES, DTU_HOSTELS, DTU_YEARS } from '../../utils/constants.js';
import { Button } from '../common/Button.js';
import { UserService } from '../../services/user.service.js';

interface ProfileCardProps {
  user: User;
  isOwner?: boolean;
  onUpdate?: (updated: User) => void;
  onOpenUpgrade?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  isOwner = false,
  onUpdate,
  onOpenUpgrade,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    branch: user.branch || DTU_BRANCHES[0],
    year: user.year || DTU_YEARS[1],
    userType: user.userType || 'HOSTELER',
    hostel: user.hostel || DTU_HOSTELS[0],
    roomNumber: user.roomNumber || '',
    phone: user.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await UserService.updateProfile(formData);
      if (res.success && res.data) {
        if (onUpdate) onUpdate(res.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isPro = Boolean(user.isProSeller);
  const maxLimit = user.maxListings || 3;

  return (
    <div className="bg-campus-card border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-campus-lime/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-campus-lime shadow-glow"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border-2 border-campus-lime text-campus-lime text-2xl font-bold flex items-center justify-center shadow-glow">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
              
              {/* Pro Seller Badge vs Verified Badge */}
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-campus-lime/20 border border-amber-400/60 text-amber-300 text-xs font-black shadow-glow">
                  <Star size={13} className="fill-amber-300" />
                  <span>Campus Pro Seller</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                  <ShieldCheck size={13} />
                  <span>Verified DTU</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-500" />
              <span>{user.email}</span>
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
              <span className="flex items-center gap-1 text-campus-gold font-bold">
                <Star size={14} className="fill-campus-gold" />
                <span>{user.rating || 5.0}</span>
                <span className="text-slate-500 font-normal">({user.reviewCount || 1} deals)</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">
                Capacity: <strong>{maxLimit} Listings</strong> {isPro ? '(Pro Tier)' : '(Free Tier)'}
              </span>
            </div>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            {!isPro && onOpenUpgrade && (
              <button
                type="button"
                onClick={onOpenUpgrade}
                className="px-3.5 py-2 rounded-2xl bg-campus-lime text-black font-black text-xs shadow-glow active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Zap size={14} className="fill-black" />
                <span>Upgrade to Pro (₹10)</span>
              </button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 size={14} />}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* Edit Profile Form vs View Details */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                DTU Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
              >
                {DTU_BRANCHES.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Year of Study
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
              >
                {DTU_YEARS.map((y, i) => (
                  <option key={i} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Campus Residence
              </label>
              <select
                value={formData.hostel}
                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
              >
                {DTU_HOSTELS.map((h, i) => (
                  <option key={i} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Room Number (Optional)
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                placeholder="e.g. A-214"
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Phone (Optional)
              </label>
              <input
                type="text"
                value={formData.phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-sm focus:border-campus-lime outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="lime"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Check size={14} />}
            >
              Save Profile
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <GraduationCap size={13} className="text-campus-lime" /> Branch & Year
            </span>
            <p className="font-bold text-white truncate">{user.branch || 'DTU Engineering'}</p>
            <p className="text-slate-400 mt-0.5">{user.year || 'Student'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Building size={13} className="text-campus-pink" /> Residence / Hostel
            </span>
            <p className="font-bold text-white truncate">{user.hostel || 'Hosteler'}</p>
            {user.roomNumber && <p className="text-slate-400 mt-0.5">Room {user.roomNumber}</p>}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Zap size={13} className="text-campus-cyan" /> Seller Tier & Limit
            </span>
            <p className="font-bold text-campus-lime">
              {isPro ? '🌟 Campus Pro (10 Items)' : 'Free Tier (3 Items)'}
            </p>
            <p className="text-slate-400 mt-0.5">
              {isPro ? '7 extra slots unlocked' : 'Upgrade for ₹10'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
