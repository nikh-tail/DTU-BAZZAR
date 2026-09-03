import React from 'react';
import { ShieldCheck, MapPin, Zap, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-100 border-t border-slate-200 pt-12 pb-8 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-campus-lime flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
                ⚡
              </div>
              <span className="font-display font-black text-lg tracking-tight text-slate-900">
                DTU BAZAAR
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The dedicated student-to-student marketplace for Delhi Technological University. Buy, sell, and exchange gear safely on campus.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
              <MapPin size={14} className="text-rose-500 flex-shrink-0" />
              <span>Bawana Road, Shahbad Daulatpur, Delhi 110042</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button onClick={() => onNavigate('browse', { category: 'DRAWING_TOOLS' })} className="hover:text-emerald-700 transition-colors">
                  📐 Drawing Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'ELECTRONICS' })} className="hover:text-emerald-700 transition-colors">
                  💻 Electronics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'BOOKS_NOTES' })} className="hover:text-emerald-700 transition-colors">
                  📚 Books & Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'FASHION' })} className="hover:text-emerald-700 transition-colors">
                  👕 Fashion & Lab Coats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'HOSTEL_REQ' })} className="hover:text-emerald-700 transition-colors">
                  🛏️ Hostel & Req
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'HOBBY_SPORT' })} className="hover:text-emerald-700 transition-colors">
                  🏸 Hobby / Sport & Cycles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', { category: 'OTHERS' })} className="hover:text-emerald-700 transition-colors">
                  📦 Others & Misc Gear
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
              Campus Safety & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                <span>Verified @dtu.ac.in Student Emails</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap size={14} className="text-rose-500 flex-shrink-0" />
                <span>0% Commission / 100% Free</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={14} className="text-sky-600 flex-shrink-0" />
                <span>Meet at Mic-Mac Canteen or OAT</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('download')}
                  className="px-2.5 py-1 rounded-lg bg-lime-100 border border-lime-300 text-lime-900 text-[11px] font-bold hover:bg-lime-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>📲</span>
                  <span>Download Mobile App (APK / iOS)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community note */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
              DTU Student Community
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Built by DTU students, for DTU students. No middlemen, no commissions, no spam.
            </p>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1 shadow-sm">
              <span className="font-bold text-slate-900 block">💡 Pro Tip for Freshers</span>
              <p>Borrow drafters & lab coats from seniors at up to 70% off retail prices!</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DTU Bazaar — Delhi Technological University.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500" />
            <span>for the DTU Campus Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
