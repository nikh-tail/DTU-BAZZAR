import React from 'react';
import { ShieldCheck, MapPin, BadgePercent, CheckCircle2 } from 'lucide-react';

export const TrustZeroSection: React.FC = () => {
  const blocks = [
    {
      title: 'SCAM RISK',
      subtitle: 'Verified DTU Credentials Only',
      description:
        'Strict signup restriction to official @dtu.ac.in emails with OTP validation. No random outsiders or fake accounts.',
      icon: <ShieldCheck size={28} className="text-campus-lime" />,
      accentColor: 'text-campus-lime',
      borderColor: 'border-campus-lime/30',
      glowColor: 'hover:shadow-glow',
      badge: 'DTU Domain Verified',
    },
    {
      title: 'DELIVERY HASSLE',
      subtitle: 'Inspect & Meet on Campus',
      description:
        'Handover in safe, populated DTU spots: Mic-Mac Canteen, Open Air Theatre (OAT), Central Library, or Hostel Gates.',
      icon: <MapPin size={28} className="text-campus-pink" />,
      accentColor: 'text-campus-pink',
      borderColor: 'border-campus-pink/30',
      glowColor: 'hover:shadow-glow-pink',
      badge: '0 Km Delivery Distance',
    },
    {
      title: 'MIDDLEMAN FEES',
      subtitle: '100% Direct Student Pricing',
      description:
        'Zero commission, zero platform cut. You negotiate price and pay directly via UPI / Cash upon physical inspection.',
      icon: <BadgePercent size={28} className="text-campus-purple" />,
      accentColor: 'text-campus-purple',
      borderColor: 'border-campus-purple/30',
      glowColor: 'hover:shadow-glow-purple',
      badge: '₹0 Platform Brokerage',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
          <span>🛡️</span> Campus Trust Promise
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Transparent Campus Trading: <span className="text-gradient-lime">Zero Surprises</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Built specifically for the Delhi Technological University student ecosystem to eliminate OLX scams and courier friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className={`relative bg-campus-card/90 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${b.borderColor} ${b.glowColor} overflow-hidden`}
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  {b.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                  {b.badge}
                </span>
              </div>

              {/* Bold ZERO Typography Header */}
              <div className="mb-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white block">
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
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CheckCircle2 size={15} className={b.accentColor} />
              <span>Campus Verified Standard</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
