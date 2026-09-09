import 'package:intl/intl.dart';

class Formatters {
  static String formatPrice(num price) {
    final formatter = NumberFormat.currency(
      locale: 'en_IN',
      symbol: '₹',
      decimalDigits: 0,
    );
    return formatter.format(price);
  }

  static String formatTimeAgo(dynamic dateInput) {
    if (dateInput == null) return 'recently';
    DateTime date;
    if (dateInput is DateTime) {
      date = dateInput;
    } else {
      date = DateTime.tryParse(dateInput.toString()) ?? DateTime.now();
    }

    final diff = DateTime.now().difference(date);
    if (diff.inDays > 30) {
      return DateFormat('d MMM').format(date);
    } else if (diff.inDays >= 1) {
      return '${diff.inDays}d ago';
    } else if (diff.inHours >= 1) {
      return '${diff.inHours}h ago';
    } else if (diff.inMinutes >= 1) {
      return '${diff.inMinutes}m ago';
    }
    return 'Just now';
  }

  static String getCategoryName(String categoryId) {
    switch (categoryId) {
      case 'DRAWING_TOOLS':
        return 'Drawing Tools';
      case 'ELECTRONICS':
        return 'Electronics';
      case 'BOOKS_NOTES':
        return 'Books & Notes';
      case 'HOSTEL_REQ':
        return 'Hostel & Req';
      case 'FASHION':
        return 'Fashion';
      case 'HOBBY_SPORT':
        return 'Hobby / Sport';
      default:
        return 'Others';
    }
  }

  static String getConditionLabel(String condition) {
    switch (condition) {
      case 'NEW':
        return 'Brand New';
      case 'LIKE_NEW':
        return 'Like New';
      case 'GOOD':
        return 'Good';
      case 'FAIR':
        return 'Fair';
      default:
        return condition;
    }
  }
}
