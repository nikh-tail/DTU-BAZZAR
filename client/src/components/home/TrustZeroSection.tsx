import React from 'react';
import { ShieldCheck, MapPin, BadgePercent, CheckCircle2 } from 'lucide-react';

export const TrustZeroSection: React.FC = () => {
  const blocks = [
    {
      title: 'COMMISSION',
      subtitle: '100% Direct Peer Pricing',
      description:
        'Zero platform cuts and zero hidden fees. Negotiate transparently with fellow students and keep every rupee of your sale.',
      icon: <BadgePercent size={28} className="text-campus-lime" />,
      accentColor: 'text-campus-lime',
      borderColor: 'border-campus-lime/30',
      glowColor: 'hover:shadow-glow',
      badge: '0% Platform Fee',
    },
    {
      title: 'DELIVERY DELAYS',
      subtitle: 'Instant On-Campus Exchange',
      description:
        'Meet at convenient, populated campus hubs like Mic-Mac Canteen, Library Lawns, OAT, or Hostel gates to inspect gear before purchase.',
      icon: <MapPin size={28} className="text-campus-pink" />,
      accentColor: 'text-campus-pink',
      borderColor: 'border-campus-pink/30',
      glowColor: 'hover:shadow-glow-pink',
      badge: 'Same-Day Handover',
    },
    {
      title: 'ANONYMITY',
      subtitle: 'Email-Verified Student Profiles',
      description:
        'Every seller and buyer is authenticated with one-time verification codes, ensuring reliable communication and transparent transactions.',
      icon: <ShieldCheck size={28} className="text-campus-purple" />,
      accentColor: 'text-campus-purple',
      borderColor: 'border-campus-purple/30',
      glowColor: 'hover:shadow-glow-purple',
      badge: 'OTP Authenticated',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          <span>🛡️</span> Built for Campus Life
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Why DTU Students Choose <span className="text-gradient-lime">DTU Bazaar</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
          Designed specifically to eliminate middleman markups, shipping delays, and untrusted transactions across the Delhi Technological University community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className={`relative bg-campus-card/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${b.borderColor} ${b.glowColor} overflow-hidden`}
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                  {b.icon}
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300">
                  {b.badge}
                </span>
              </div>

              {/* Bold ZERO Typography Header */}
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white block leading-none">
                  ZERO
                </span>
                <span className={`text-base sm:text-lg font-black tracking-wider uppercase ${b.accentColor}`}>
                  {b.title}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-200 mb-2">{b.subtitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
            </div>

            {/* Checkmark guarantee */}
            <div className="mt-7 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CheckCircle2 size={15} className={b.accentColor} />
              <span>Campus Verified Standard</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
