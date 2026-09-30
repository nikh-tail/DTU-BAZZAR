class ImageUrlUtil {
  static const String serverBase = 'https://dtu-bazzar.onrender.com';

  static const Map<String, String> categoryFallbacks = {
    'DRAWING_TOOLS':
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'LAB_STATIONERY':
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'ELECTRONICS':
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    'BOOKS_NOTES':
        'https://images.unsplash.com/photo-1532012164546-f432f2e372fe?w=600&auto=format&fit=crop&q=80',
    'BOOKS_ACADEMICS':
        'https://images.unsplash.com/photo-1532012164546-f432f2e372fe?w=600&auto=format&fit=crop&q=80',
    'FASHION':
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    'HOSTEL_REQ':
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    'HOSTEL_ESSENTIALS':
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    'HOBBY_SPORT':
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    'SPORTS_FITNESS':
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    'CYCLES':
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
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
