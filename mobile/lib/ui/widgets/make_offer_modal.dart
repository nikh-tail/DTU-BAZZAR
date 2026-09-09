import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/formatters.dart';
import 'custom_button.dart';

class MakeOfferModal extends StatefulWidget {
  final num originalPrice;
  final String listingTitle;
  final Function(num offeredPrice, String message) onSubmitOffer;

  const MakeOfferModal({
    super.key,
    required this.originalPrice,
    required this.listingTitle,
    required this.onSubmitOffer,
  });

  @override
  State<MakeOfferModal> createState() => _MakeOfferModalState();
}

class _MakeOfferModalState extends State<MakeOfferModal> {
  late TextEditingController _priceController;
  final TextEditingController _msgController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final defaultOffer = (widget.originalPrice * 0.9).round();
    _priceController = TextEditingController(text: defaultOffer.toString());
  }

  @override
  void dispose() {
    _priceController.dispose();
    _msgController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('🤝', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 8),
                  Text(
                    'Make a Price Offer',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            widget.listingTitle,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 16),

          // Price info
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Listed Price',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                ),
                Text(
                  Formatters.formatPrice(widget.originalPrice),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Quick % Offer buttons
          Row(
            children: [
              _buildPercentButton(0.95, '5% Off'),
              const SizedBox(width: 8),
              _buildPercentButton(0.90, '10% Off'),
              const SizedBox(width: 8),
              _buildPercentButton(0.85, '15% Off'),
            ],
          ),
          const SizedBox(height: 16),

          // Custom price input
          TextField(
            controller: _priceController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Your Offer (₹)',
              prefixText: '₹ ',
            ),
          ),
          const SizedBox(height: 12),

          // Message input
          TextField(
            controller: _msgController,
            decoration: const InputDecoration(
              hintText: 'Add a friendly note for the campus seller...',
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 20),

          CustomButton(
            text: 'Send Offer to Seller',
            width: double.infinity,
            onPressed: () {
              final offer = num.tryParse(_priceController.text) ?? widget.originalPrice;
              widget.onSubmitOffer(offer, _msgController.text);
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPercentButton(double multiplier, String label) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          final val = (widget.originalPrice * multiplier).round();
          _priceController.text = val.toString();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
    );
  }
}
