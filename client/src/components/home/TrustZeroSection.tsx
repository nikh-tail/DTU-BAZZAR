import React from 'react';
import { ShieldCheck, MapPin, BadgePercent, CheckCircle2 } from 'lucide-react';

export const TrustZeroSection: React.FC = () => {
  const blocks = [
    {
      title: 'SCAM RISK',
      subtitle: 'Verified DTU Credentials Only',
      description:
        'Strict signup restriction to official @dtu.ac.in emails with OTP validation. No random outsiders or fake accounts.',
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      accentColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      glowColor: 'hover:shadow-lg',
      badge: 'DTU Domain Verified',
    },
    {
      title: 'DELIVERY HASSLE',
      subtitle: 'Inspect & Meet on Campus',
      description:
        'Handover in safe, populated DTU spots: Mic-Mac Canteen, Open Air Theatre (OAT), Central Library, or Hostel Gates.',
      icon: <MapPin size={28} className="text-rose-500" />,
      accentColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      glowColor: 'hover:shadow-lg',
      badge: '0 Km Delivery Distance',
    },
    {
      title: 'MIDDLEMAN FEES',
      subtitle: '100% Direct Student Pricing',
      description:
        'Zero commission, zero platform cut. You negotiate price and pay directly via UPI / Cash upon physical inspection.',
      icon: <BadgePercent size={28} className="text-purple-600" />,
      accentColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      glowColor: 'hover:shadow-lg',
      badge: '₹0 Platform Brokerage',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 shadow-sm">
          <span>🛡️</span> Campus Trust Promise
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Transparent Campus Trading: <span className="text-emerald-700">Zero Surprises</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-medium">
          Built specifically for the Delhi Technological University student ecosystem to eliminate OLX scams and courier friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className={`relative bg-white border ${b.borderColor} rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${b.glowColor} overflow-hidden shadow-sm`}
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {b.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                  {b.badge}
                </span>
              </div>

              {/* Bold ZERO Typography Header */}
              <div className="mb-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 block">
                  ZERO
                </span>
                <span className={`text-base sm:text-lg font-black tracking-wider uppercase ${b.accentColor}`}>
                  {b.title}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-2">{b.subtitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{b.description}</p>
            </div>

            {/* Checkmark guarantee */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 size={15} className={b.accentColor} />
              <span>Campus Verified Standard</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
