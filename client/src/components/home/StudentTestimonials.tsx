import React from 'react';
import { Star, Quote } from 'lucide-react';

export const StudentTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Tanmay Saxena',
      tag: 'CSE, 4th Year • VVS Hostel',
      text: 'Sold my Hero cycle in 2 hours before vacating hostel. Met the buyer right downstairs at the VVS mess gate. Zero headache!',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Deshmukh',
      tag: 'ECE, 2nd Year • Day Scholar',
      text: 'Got an original Casio 991EX calculator for ₹750 from a senior instead of paying ₹1,600 on Amazon. Verified DTU student profile made it super safe.',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Karan Mehra',
      tag: 'Mechanical, 3rd Year • Aryabhatta Hostel',
      text: 'Found a working Symphony desert cooler right when Delhi peak heat started in May. Chatting with the senior in-app made bargaining straightforward.',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Loved by DTU Students
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real peer feedback from students across hostels and day-scholar batches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between relative group hover:border-slate-300 transition-all shadow-sm"
          >
            <Quote className="absolute top-5 right-5 text-slate-200 group-hover:text-emerald-200 transition-colors" size={32} />

            <div>
              <div className="flex items-center gap-1 mb-3 text-amber-500">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 italic font-medium">
                "{r.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400/50"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{r.tag}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
