import React from 'react';
import { IndianRupee, Users, PackageCheck, Star } from 'lucide-react';

export const CampusStats: React.FC = () => {
  const stats = [
    { label: 'Student Savings Generated', value: '₹15 Lakhs+', icon: <IndianRupee size={22} className="text-campus-lime" /> },
    { label: 'Verified DTU Students', value: '1,450+', icon: <Users size={22} className="text-campus-pink" /> },
    { label: 'Campus Items Sold', value: '920+', icon: <PackageCheck size={22} className="text-campus-cyan" /> },
    { label: 'Peer Satisfaction Rate', value: '4.9 / 5.0', icon: <Star size={22} className="text-campus-gold" /> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-gradient-to-r from-campus-card via-slate-900 to-campus-card border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {stats.map((s, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-4 sm:pt-0' : ''}`}>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-3">
                {s.icon}
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
