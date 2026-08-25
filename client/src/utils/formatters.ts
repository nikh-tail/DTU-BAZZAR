export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatCurrency = formatPrice;

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export const getCategoryBadge = (category: string): string => {
  const map: Record<string, string> = {
    CYCLES: '🚲 Cycles',
    ELECTRONICS: '💻 Tech Gear',
    BOOKS_ACADEMICS: '📚 Books & Notes',
    HOSTEL_ESSENTIALS: '🛏️ Hostel Essentials',
    LAB_STATIONERY: '📐 Lab Kits',
    SPORTS_FITNESS: '🏸 Sports',
    OTHER: '📦 General',
  };
  return map[category] || category;
};
