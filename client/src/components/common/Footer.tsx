import React from 'react';
import { ShieldCheck, MapPin, Zap, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#05080F] border-t border-slate-800/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-campus-lime flex items-center justify-center text-black font-black text-base shadow-glow">
                ⚡
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                DTU BAZAAR
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The dedicated student-to-student marketplace for Delhi Technological University. Buy, sell, and exchange gear safely on campus.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <MapPin size={14} className="text-campus-pink" />
              <span>Bawana Road, Shahbad Daulatpur, Delhi 110042</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3.5">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-campus-lime transition-colors">
                  🚲 Cycles & Campus Mobility
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-campus-lime transition-colors">
                  💻 Scientific Calculators & Tech
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-campus-lime transition-colors">
                  📚 CSE / ECE / ME Notes & Books
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-campus-lime transition-colors">
                  🛏️ Desert Coolers & Hostel Gear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-campus-lime transition-colors">
                  📐 Mini Drafters & Lab Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3.5">
              Campus Safety & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-campus-lime" />
                <span>Verified @dtu.ac.in Student Emails</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap size={14} className="text-campus-pink" />
                <span>0% Commission / 100% Free</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={14} className="text-campus-cyan" />
                <span>Meet at Mic-Mac Canteen or OAT</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('download')}
                  className="px-2.5 py-1 rounded-lg bg-campus-lime/15 border border-campus-lime/40 text-campus-lime text-[11px] font-bold hover:bg-campus-lime/25 transition-all flex items-center gap-1.5"
                >
                  <span>📲</span>
                  <span>Download Mobile App (APK / iOS)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Notice */}
          <div className="p-4 rounded-2xl bg-campus-card border border-slate-800">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <span>🎓</span> Student-to-Student Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              DTU Bazaar is an open-source student platform created for campus peers. Always inspect items in person inside university premises before completing UPI or cash payment.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© 2026 DTU Bazaar • Delhi Technological University Student Community</p>
          <div className="flex items-center gap-1.5">
            <span>Built by</span>
            <a
              href="https://www.linkedin.com/in/nikhil-rathor-761675389/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-campus-lime font-bold hover:underline"
            >
              Nikhil Rathor
            </a>
            <span>• Crafted with</span>
            <Heart size={12} className="text-campus-pink fill-campus-pink inline" />
            <span>for DTU Engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
