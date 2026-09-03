import { CATEGORIES } from './constants.js';

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80';

/**
 * Resolves an image URL properly across local development, Vercel, and Render CDN.
 * Handles relative `/uploads/...` paths, full URLs, data URLs, and null fallbacks.
 */
export function getImageUrl(url?: string | null, category?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getCategoryFallback(category);
  }

  const trimmed = url.trim();

  // If already absolute URL or base64 data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If relative path like `/uploads/...` or `uploads/...`
  const relativePath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const apiUrl = (import.meta.env.VITE_API_URL || 'https://dtu-bazzar.onrender.com').replace(/\/+$/, '');

  return `${apiUrl}${relativePath}`;
}

/**
 * Returns a high quality relevant default image based on category
 */
export function getCategoryFallback(category?: string): string {
  if (!category) return DEFAULT_FALLBACK_IMAGE;
  const match = CATEGORIES.find((c) => c.id === category);
  return match?.image || DEFAULT_FALLBACK_IMAGE;
}

/**
 * Graceful error fallback handler for <img> elements
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string
) {
  const fallback = getCategoryFallback(category);
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
}
