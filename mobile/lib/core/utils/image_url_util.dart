class ImageUrlUtil {
  static const String serverBase = 'https://dtu-bazzar.onrender.com';

  static const Map<String, String> categoryFallbacks = {
    'DRAWING_TOOLS':
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'LAB_STATIONERY':
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'ELECTRONICS':
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    'BOOKS_NOTES':
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    'BOOKS_ACADEMICS':
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    'FASHION':
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    'HOSTEL_REQ':
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    'HOSTEL_ESSENTIALS':
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    'HOBBY_SPORT':
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    'SPORTS_FITNESS':
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    'CYCLES':
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80',
    'OTHER':
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    'OTHERS':
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
  };

  static String getCategoryFallback(String? category) {
    if (category == null) return categoryFallbacks['OTHER']!;
    return categoryFallbacks[category.toUpperCase()] ?? categoryFallbacks['OTHER']!;
  }

  static String resolve(String? rawUrl, {String? category}) {
    if (rawUrl == null || rawUrl.trim().isEmpty) {
      return getCategoryFallback(category);
    }

    final trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    if (trimmed.startsWith('/')) {
      return '$serverBase$trimmed';
    }

    return '$serverBase/$trimmed';
  }
}
