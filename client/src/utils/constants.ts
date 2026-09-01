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
    id: 'DRAWING_TOOLS',
    name: 'Drawing Tools',
    shortName: 'Drawing Tools',
    subtitle: 'Mini Drafters, Sheets, Compasses & Scales',
    icon: '📐',
    gradient: 'from-emerald-500/30 to-teal-600/30 border-emerald-500/40',
    bgGradient: 'bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ELECTRONICS',
    name: 'Electronics',
    shortName: 'Electronics',
    subtitle: 'Scientific Calculators, Keyboards, Audio & Tech',
    icon: '💻',
    gradient: 'from-cyan-500/30 to-blue-600/30 border-cyan-500/40',
    bgGradient: 'bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'BOOKS_NOTES',
    name: 'Books & Notes',
    shortName: 'Books & Notes',
    subtitle: 'CSE / ECE / ME Notes, PYQs & Reference Books',
    icon: '📚',
    gradient: 'from-pink-500/30 to-rose-600/30 border-pink-500/40',
    bgGradient: 'bg-gradient-to-br from-pink-950/40 via-rose-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'FASHION',
    name: 'Fashion',
    shortName: 'Fashion',
    subtitle: 'White Lab Coats, Hoodies, Clothes & Footwear',
    icon: '👕',
    gradient: 'from-amber-500/30 to-orange-600/30 border-amber-500/40',
    bgGradient: 'bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'HOSTEL_REQ',
    name: 'Hostel & Req',
    shortName: 'Hostel & Req',
    subtitle: 'Desert Coolers, Mattresses, Kettles & Essentials',
    icon: '🛏️',
    gradient: 'from-purple-500/30 to-indigo-600/30 border-purple-500/40',
    bgGradient: 'bg-gradient-to-br from-purple-950/40 via-indigo-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'HOBBY_SPORT',
    name: 'Hobby / Sport',
    shortName: 'Hobby & Sport',
    subtitle: 'Cycles, Badminton, Gym Gear & Instruments',
    icon: '🏸',
    gradient: 'from-lime-500/30 to-green-600/30 border-lime-500/40',
    bgGradient: 'bg-gradient-to-br from-lime-950/40 via-green-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'OTHERS',
    name: 'Others',
    shortName: 'Others',
    subtitle: 'Miscellaneous Campus Gear & Everyday Items',
    icon: '📦',
    gradient: 'from-slate-500/30 to-zinc-600/30 border-slate-500/40',
    bgGradient: 'bg-gradient-to-br from-slate-950/40 via-zinc-950/20 to-campus-card',
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80',
  },
];

export const SUB_CATEGORIES_PILLS = [
  { label: 'All Items', category: 'ALL', icon: '⚡' },
  { label: 'Drawing Tools', category: 'DRAWING_TOOLS', icon: '📐' },
  { label: 'Electronics', category: 'ELECTRONICS', icon: '💻' },
  { label: 'Books & Notes', category: 'BOOKS_NOTES', icon: '📚' },
  { label: 'Fashion', category: 'FASHION', icon: '👕' },
  { label: 'Hostel & Req', category: 'HOSTEL_REQ', icon: '🛏️' },
  { label: 'Hobby / Sport', category: 'HOBBY_SPORT', icon: '🏸' },
  { label: 'Others', category: 'OTHERS', icon: '📦' },
];

export const DTU_HOSTELS = [
  'Aryabhatta Hostel',
  'Sir Visvesvaraya (VVS) Hostel',
  'Sir C.V. Raman Hostel',
  'Homi Bhabha Hostel',
  'APJ Abdul Kalam Hostel',
  'Sister Nivedita Hostel (Girls)',
  'Kalpana Chawla Hostel (Girls)',
  'Type-2 / Married Research Hostel',
];

export const DTU_BRANCHES = [
  'Computer Science & Engineering (COE)',
  'Information Technology (IT)',
  'Software Engineering (SE)',
  'Mathematics & Computing (MCE)',
  'Electronics & Communication (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Production & Industrial (PIE)',
  'Environmental Engineering (ENE)',
  'Biotechnology (BT)',
  'Design (B.Des)',
  'Delhi School of Management (MBA)',
];

export const DTU_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'M.Tech / PhD'];

export const CONDITION_LABELS: Record<
  ListingCondition,
  { label: string; desc: string; color: string }
> = {
  NEW: {
    label: 'Brand New',
    desc: 'Unopened / Sealed box',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  LIKE_NEW: {
    label: 'Like New',
    desc: 'Barely used, flawless',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  GOOD: {
    label: 'Good',
    desc: 'Normal minor wear, 100% working',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  FAIR: {
    label: 'Fair',
    desc: 'Visible wear, perfectly functional',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  },
};

export const CONDITIONS: { id: ListingCondition; label: string; description: string }[] = [
  { id: 'NEW', label: 'Brand New', description: 'Unopened / Sealed original box' },
  { id: 'LIKE_NEW', label: 'Like New', description: 'Used once or twice, zero scratches' },
  { id: 'GOOD', label: 'Good condition', description: 'Minor cosmetic signs of normal campus use' },
  { id: 'FAIR', label: 'Fair / Usable', description: 'Fully functional with visible wear' },
];
