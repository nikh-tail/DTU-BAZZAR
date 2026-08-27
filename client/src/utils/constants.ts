import { ListingCategory, ListingCondition } from '../types/index.js';

export const CATEGORIES: {
  id: ListingCategory;
  name: string;
  shortName: string;
  subtitle: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  image: string;
}[] = [
  {
    id: 'CYCLES',
    name: 'Cycles & Mobility',
    shortName: 'Cycles',
    subtitle: 'Hero, Firefox, Geared & Single Speed',
    icon: '🚲',
    gradient: 'from-amber-500/30 to-orange-600/30 border-orange-500/40',
    bgGradient: 'bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ELECTRONICS',
    name: 'Electronics & Tech',
    shortName: 'Tech Gear',
    subtitle: 'Monitors, Calculators, Keyboards & Audio',
    icon: '💻',
    gradient: 'from-cyan-500/30 to-blue-600/30 border-cyan-500/40',
    bgGradient: 'bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'BOOKS_ACADEMICS',
    name: 'Books & Semester Notes',
    shortName: 'Books & Notes',
    subtitle: 'CLRS, Mano, Hand-written Notes & PYQs',
    icon: '📚',
    gradient: 'from-pink-500/30 to-rose-600/30 border-pink-500/40',
    bgGradient: 'bg-gradient-to-br from-pink-950/40 via-rose-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'HOSTEL_ESSENTIALS',
    name: 'Hostel Essentials & Gear',
    shortName: 'Hostel Gear',
    subtitle: 'Desert Coolers, Mattresses, Kettles & Lamps',
    icon: '🛏️',
    gradient: 'from-purple-500/30 to-indigo-600/30 border-purple-500/40',
    bgGradient: 'bg-gradient-to-br from-purple-950/40 via-indigo-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'LAB_STATIONERY',
    name: 'Lab Kits & Drafters',
    shortName: 'Lab Kits',
    subtitle: 'Mini Drafters, Lab Coats, Calipers & Tubes',
    icon: '📐',
    gradient: 'from-emerald-500/30 to-teal-600/30 border-emerald-500/40',
    bgGradient: 'bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'SPORTS_FITNESS',
    name: 'Sports & Fitness',
    shortName: 'Sports',
    subtitle: 'Badminton, Dumbbells, Footballs & Kits',
    icon: '🏸',
    gradient: 'from-lime-500/30 to-green-600/30 border-lime-500/40',
    bgGradient: 'bg-gradient-to-br from-lime-950/40 via-green-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'OTHER',
    name: 'Other Campus Goods',
    shortName: 'Other',
    subtitle: 'Musical Instruments, Jackets & Misc',
    icon: '📦',
    gradient: 'from-slate-500/30 to-zinc-600/30 border-slate-500/40',
    bgGradient: 'bg-gradient-to-br from-slate-950/40 via-zinc-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80',
  },
];

export const SUB_CATEGORIES_PILLS = [
  { label: 'All Items', category: 'ALL', icon: '⚡' },
  { label: 'Scientific Calculators', category: 'ELECTRONICS', icon: '🔢' },
  { label: 'Geared Cycles', category: 'CYCLES', icon: '🚲' },
  { label: 'Desert Coolers', category: 'HOSTEL_ESSENTIALS', icon: '❄️' },
  { label: 'Coding Monitors', category: 'ELECTRONICS', icon: '🖥️' },
  { label: 'Mini Drafters', category: 'LAB_STATIONERY', icon: '📐' },
  { label: 'CSE / ECE Notes', category: 'BOOKS_ACADEMICS', icon: '📖' },
  { label: 'Hostel Mattresses', category: 'HOSTEL_ESSENTIALS', icon: '🛏️' },
  { label: 'Badminton Rackets', category: 'SPORTS_FITNESS', icon: '🏸' },
  { label: 'Lab Coats & Kits', category: 'LAB_STATIONERY', icon: '🥼' },
];

export const DTU_HOSTELS = [
  'Aryabhatta Hostel',
  'Sir Visvesvaraya (VVS) Hostel',
  'Sir JC Bose Hostel',
  'Sir CV Raman Hostel',
  'Bhaskaracharya Hostel',
  'Varahamihira Hostel',
  'Brahmagupta Hostel',
  'Kalpana Chawla Girls Hostel',
  'Sister Nivedita Girls Hostel',
  'Type-II / PG Hostel',
  'Day Scholar (Rohini / North Delhi)',
  'Day Scholar (West / South Delhi)',
  'Day Scholar (Noida / East Delhi)',
  'Day Scholar (Gurugram / Faridabad)',
];

export const DTU_BRANCHES = [
  'Computer Science & Engineering (COE)',
  'Information Technology (IT)',
  'Software Engineering (SE)',
  'Mathematics & Computing (MC)',
  'Electronics & Communication (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Production & Industrial (PE)',
  'Civil Engineering (CE)',
  'Chemical Engineering (CHE)',
  'Biotechnology (BT)',
  'Environmental Engineering (ENE)',
  'Engineering Physics (EP)',
  'Department of Design (DoD)',
  'Delhi School of Management (DSM)',
];

export const DTU_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'M.Tech / MBA / PhD'];

export const CONDITION_LABELS: Record<ListingCondition, { label: string; color: string; desc: string }> = {
  NEW: { label: 'Brand New', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Never used, original packing' },
  LIKE_NEW: { label: 'Like New', color: 'bg-campus-lime/20 text-campus-lime border-campus-lime/40', desc: 'Barely used, zero scratches' },
  GOOD: { label: 'Good', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40', desc: 'Fully functional, normal wear' },
  FAIR: { label: 'Fair', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Usable condition, visible marks' },
};
