import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/formatters.dart';

class ConditionBadge extends StatelessWidget {
  final String condition;
  final bool isSmall;

  const ConditionBadge({
    super.key,
    required this.condition,
    this.isSmall = false,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color text;
    Color border;

    switch (condition) {
      case 'NEW':
        bg = const Color(0xFFD1FAE5);
        text = const Color(0xFF065F46);
        border = const Color(0xFF6EE7B7);
        break;
      case 'LIKE_NEW':
        bg = const Color(0xFFE0F2FE);
        text = const Color(0xFF075985);
        border = const Color(0xFF7DD3FC);
        break;
      case 'GOOD':
        bg = const Color(0xFFFEF3C7);
        text = const Color(0xFF92400E);
        border = const Color(0xFFFCD34D);
        break;
      default:
        bg = const Color(0xFFFFE4E6);
        text = const Color(0xFF9F1239);
        border = const Color(0xFFFDA4AF);
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmall ? 6 : 8,
        vertical: isSmall ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: border, width: 1),
      ),
      child: Text(
        Formatters.getConditionLabel(condition),
        style: TextStyle(
          color: text,
          fontSize: isSmall ? 10 : 11,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
