import 'package:flutter/material.dart';

class WhatsAppIcon extends StatelessWidget {
  final double size;

  const WhatsAppIcon({super.key, this.size = 22.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(
        color: Color(0xFF25D366), // Official WhatsApp Green
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Icon(
          Icons.phone,
          size: size * 0.58,
          color: Colors.white,
        ),
      ),
    );
  }
}

class WhatsAppButton extends StatelessWidget {
  final VoidCallback onTap;
  final String label;

  const WhatsAppButton({
    super.key,
    required this.onTap,
    this.label = 'WhatsApp',
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF25D366).withOpacity(0.15),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF25D366), width: 1.2),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const WhatsAppIcon(size: 18),
            const SizedBox(width: 6),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Color(0xFF128C7E),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
