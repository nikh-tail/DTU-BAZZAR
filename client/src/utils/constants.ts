import { ListingCategory, ListingCondition } from '../types/index.js';

export const CATEGORIES: {
  id: ListingCategory;
  name: string;
  shortName: string;
  subtitle: string;
  icon: string;
  stripColor: string;
  stripHex: string;
  headerHoverBg: string;
  gradient: string;
  bgGradient: string;
  image: string;
}[] = [
  {
    id: 'DRAWING_TOOLS',
    name: 'Drawing Tools',
    shortName: 'Drawing Tools',
    subtitle: 'Calculators, drafters, scale sets & more',
    icon: '📐',
    stripColor: 'bg-orange-500',
    stripHex: '#F97316',
    headerHoverBg: 'group-hover:bg-orange-500',
    gradient: 'from-orange-500/20 to-amber-600/20 border-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-orange-50 via-amber-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ELECTRONICS',
    name: 'Electronics',
    shortName: 'Electronics',
    subtitle: 'Laptops, keyboards, chargers & more',
    icon: '💻',
    stripColor: 'bg-purple-600',
    stripHex: '#8B5CF6',
    headerHoverBg: 'group-hover:bg-purple-600',
    gradient: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-50 via-indigo-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'BOOKS_NOTES',
    name: 'Books & Notes',
    shortName: 'Books & Notes',
    subtitle: 'Engineering math, syllabus books & notes',
    icon: '📚',
    stripColor: 'bg-blue-500',
    stripHex: '#3B82F6',
    headerHoverBg: 'group-hover:bg-blue-500',
    gradient: 'from-blue-500/20 to-sky-600/20 border-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-50 via-sky-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'HOSTEL_REQ',
    name: 'Hostel & Req',
    shortName: 'Hostel & Req',
    subtitle: 'Coolers, mattresses, kettles & bedsheets',
    icon: '🛏️',
    stripColor: 'bg-emerald-500',
    stripHex: '#10B981',
    headerHoverBg: 'group-hover:bg-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'FASHION',
    name: 'Fashion',
    shortName: 'Fashion',
    subtitle: 'Lab coats, hoodies, sports gear & uniforms',
    icon: '👕',
    stripColor: 'bg-pink-500',
    stripHex: '#EC4899',
    headerHoverBg: 'group-hover:bg-pink-500',
    gradient: 'from-pink-500/20 to-rose-600/20 border-pink-500/30',
    bgGradient: 'bg-gradient-to-br from-pink-50 via-rose-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'HOBBY_SPORT',
    name: 'Hobby / Sport',
    shortName: 'Hobby & Sport',
    subtitle: 'Cycles, badminton racquets & gym gear',
    icon: '🏸',
    stripColor: 'bg-teal-500',
    stripHex: '#14B8A6',
    headerHoverBg: 'group-hover:bg-teal-500',
    gradient: 'from-teal-500/20 to-cyan-600/20 border-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-50 via-cyan-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'OTHERS',
    name: 'Others',
    shortName: 'Others',
    subtitle: 'Misc campus equipment, gadgets & more',
    icon: '📦',
    stripColor: 'bg-gray-500',
    stripHex: '#6B7280',
    headerHoverBg: 'group-hover:bg-slate-600',
    gradient: 'from-slate-500/20 to-zinc-600/20 border-slate-400/30',
    bgGradient: 'bg-gradient-to-br from-slate-50 via-zinc-50/60 to-white',
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80',
  },
];

export const SUB_CATEGORIES_PILLS = [
  { label: 'All Items', category: 'ALL', icon: '⚡' },
  { label: 'Drawing Tools', category: 'DRAWING_TOOLS', icon: '📐' },
  { label: 'Electronics', category: 'ELECTRONICS', icon: '💻' },
  { label: 'Books & Notes', category: 'BOOKS_NOTES', icon: '📚' },
  { label: 'Hostel & Req', category: 'HOSTEL_REQ', icon: '🛏️' },
  { label: 'Fashion', category: 'FASHION', icon: '👕' },
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
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  LIKE_NEW: {
    label: 'Like New',
    desc: 'Barely used, flawless',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  GOOD: {
    label: 'Good',
    desc: 'Minor wear, 100% working',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  FAIR: {
    label: 'Fair',
    desc: 'Heavy signs of use',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
  },
};
