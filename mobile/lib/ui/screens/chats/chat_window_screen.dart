import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/utils/url_launcher_util.dart';
import '../../../core/utils/image_url_util.dart';
import '../../../state/auth_provider.dart';
import '../../../state/chat_provider.dart';
import '../../widgets/whatsapp_icon.dart';
import '../../widgets/custom_button.dart';

class ChatWindowScreen extends StatefulWidget {
  final String conversationId;
  final String sellerName;
  final String itemTitle;
  final num? listingPrice;
  final String? sellerPhone;

  const ChatWindowScreen({
    super.key,
    required this.conversationId,
    required this.sellerName,
    required this.itemTitle,
    this.listingPrice,
    this.sellerPhone,
  });

  @override
  State<ChatWindowScreen> createState() => _ChatWindowScreenState();
}

class _ChatWindowScreenState extends State<ChatWindowScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ImagePicker _picker = ImagePicker();
  bool _isUploadingMedia = false;

  // Preset quick chips categories for instant 1-tap messaging
  static const List<String> quickPhrases = [
    '⚡ Is this item still available?',
    '💰 Is the price negotiable?',
    '🤝 What\'s your best final price?',
    '📍 Can we meet at Mic-Mac?',
    '📍 Meet at Mech Dept / Amul?',
    '📍 Are you in Aryabhatta Hostel?',
    '📍 Can we meet near DTU Main Gate?',
    '🕒 Can I inspect and collect it today?',
    '💵 Can we do a cash deal on campus?',
    '📦 Does it come with all original accessories?',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ChatProvider>(context, listen: false)
          .openConversation(widget.conversationId);
    });
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 120), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend([String? presetText]) async {
    final text = (presetText ?? _msgController.text).trim();
    if (text.isEmpty) return;

    if (presetText == null) {
      _msgController.clear();
    }

    final chatProv = Provider.of<ChatProvider>(context, listen: false);
    final success = await chatProv.sendMessage(text);

    if (success) {
      _scrollToBottom();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to send message. Please retry.')),
      );
    }
  }

  // =========================================================================
  // Media Sharing (Photos & Videos)
  // =========================================================================
  void _showMediaPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 38,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 18),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const Text(
                  'Share Photos & Videos',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 18),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildMediaOption(
                      icon: Icons.camera_alt_rounded,
                      label: 'Take Photo',
                      color: Colors.blueAccent,
                      onTap: () {
                        Navigator.pop(context);
                        _pickAndSendImage(ImageSource.camera);
                      },
                    ),
                    _buildMediaOption(
                      icon: Icons.photo_library_rounded,
                      label: 'Photo Gallery',
                      color: Colors.purpleAccent,
                      onTap: () {
                        Navigator.pop(context);
                        _pickAndSendImage(ImageSource.gallery);
                      },
                    ),
                    _buildMediaOption(
                      icon: Icons.videocam_rounded,
                      label: 'Record Video',
                      color: Colors.orangeAccent,
                      onTap: () {
                        Navigator.pop(context);
                        _pickAndSendVideo();
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMediaOption({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: color.withOpacity(0.14),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickAndSendImage(ImageSource source) async {
    try {
      final photo = await _picker.pickImage(source: source, imageQuality: 70);
      if (photo == null) return;

      setState(() => _isUploadingMedia = true);

      // Send image message format
      final photoMsg = '📸 [PHOTO]: ${photo.path}';
      _handleSend(photoMsg);

      setState(() => _isUploadingMedia = false);
    } catch (e) {
      setState(() => _isUploadingMedia = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not access image: $e')),
        );
      }
    }
  }

  Future<void> _pickAndSendVideo() async {
    try {
      final video = await _picker.pickVideo(
        source: ImageSource.camera,
        maxDuration: const Duration(seconds: 30),
      );
      if (video == null) return;

      setState(() => _isUploadingMedia = true);

      final videoMsg = '🎥 [VIDEO]: ${video.path}';
      _handleSend(videoMsg);

      setState(() => _isUploadingMedia = false);
    } catch (e) {
      setState(() => _isUploadingMedia = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not record video: $e')),
        );
      }
    }
  }

  // =========================================================================
  // Make an Offer Feature
  // =========================================================================
  void _openMakeOfferSheet() {
    final listedPrice = widget.listingPrice ?? 500;
    final TextEditingController offerController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Make a Price Offer',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLime.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'Listed: ₹$listedPrice',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Send a counter-offer for "${widget.itemTitle.isNotEmpty ? widget.itemTitle : 'this item'}"',
                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 18),

              // Quick Discount Chips
              const Text('Quick Suggestions', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  _buildDiscountChip(
                    label: '-10% (₹${(listedPrice * 0.9).round()})',
                    amount: (listedPrice * 0.9).round(),
                    controller: offerController,
                  ),
                  _buildDiscountChip(
                    label: '-15% (₹${(listedPrice * 0.85).round()})',
                    amount: (listedPrice * 0.85).round(),
                    controller: offerController,
                  ),
                  _buildDiscountChip(
                    label: '-20% (₹${(listedPrice * 0.8).round()})',
                    amount: (listedPrice * 0.8).round(),
                    controller: offerController,
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Custom Price Input
              TextField(
                controller: offerController,
                keyboardType: TextInputType.number,
                autofocus: true,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                decoration: const InputDecoration(
                  prefixText: '₹ ',
                  prefixStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                  hintText: 'Enter offer amount',
                  labelText: 'Your Offer Price',
                ),
              ),
              const SizedBox(height: 20),

              CustomButton(
                text: 'Send Offer to Seller',
                width: double.infinity,
                onPressed: () {
                  final enteredPrice = num.tryParse(offerController.text.trim());
                  if (enteredPrice == null || enteredPrice <= 0) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please enter a valid offer amount.')),
                    );
                    return;
                  }

                  Navigator.pop(context);
                  final offerMessage =
                      '🤝 PRICE OFFER: ₹$enteredPrice (Listed price: ₹$listedPrice)\nCan you do this price for quick campus handover?';
                  _handleSend(offerMessage);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDiscountChip({
    required String label,
    required int amount,
    required TextEditingController controller,
  }) {
    return ActionChip(
      label: Text(label),
      labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
      backgroundColor: const Color(0xFFF1F5F9),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onPressed: () {
        controller.text = amount.toString();
      },
    );
  }

  void _handleWhatsAppRedirect() {
    final phone = widget.sellerPhone ?? '919315096256';
    final msg =
        'Hi ${widget.sellerName}! I saw your item on DTU Bazaar "${widget.itemTitle}". Are you free to discuss price or meetup on campus?';
    UrlLauncherUtil.openWhatsApp(phone: phone, message: msg);
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final chatProv = Provider.of<ChatProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.sellerName,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            if (widget.itemTitle.isNotEmpty)
              Text(
                widget.itemTitle,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.emeraldPrimary,
                  fontWeight: FontWeight.w700,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
          ],
        ),
        actions: [
          // Make Offer button in AppBar
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _openMakeOfferSheet,
              icon: const Text('🏷️', style: TextStyle(fontSize: 12)),
              label: const Text('Offer', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
            ),
          ),
          const SizedBox(width: 6),
          // WhatsApp direct action
          IconButton(
            tooltip: 'Chat on WhatsApp',
            icon: const WhatsAppIcon(size: 24),
            onPressed: _handleWhatsAppRedirect,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: chatProv.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.emeraldPrimary))
                : chatProv.messages.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('💬', style: TextStyle(fontSize: 40)),
                              const SizedBox(height: 12),
                              Text(
                                'Start chatting with ${widget.sellerName}!',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Tap any quick chip below or send an offer to get a fast reply.',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: chatProv.messages.length,
                        itemBuilder: (context, index) {
                          final msg = chatProv.messages[index];
                          final isMe = msg.senderId == auth.user?.id;
                          return _buildMessageBubble(msg, isMe);
                        },
                      ),
          ),

          if (_isUploadingMedia)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 4),
              child: LinearProgressIndicator(color: AppColors.emeraldPrimary),
            ),

          // Quick Clickable Phrases Carousel
          Container(
            height: 42,
            padding: const EdgeInsets.symmetric(vertical: 4),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border, width: 0.8)),
            ),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: quickPhrases.length + 1,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                if (idx == 0) {
                  return ActionChip(
                    avatar: const Text('🏷️', style: TextStyle(fontSize: 12)),
                    label: const Text('Make Offer', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF92400E))),
                    backgroundColor: const Color(0xFFFEF3C7),
                    side: const BorderSide(color: Color(0xFFFCD34D)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    onPressed: _openMakeOfferSheet,
                  );
                }
                final phrase = quickPhrases[idx - 1];
                return ActionChip(
                  label: Text(
                    phrase,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                  backgroundColor: const Color(0xFFF1F5F9),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  side: const BorderSide(color: AppColors.border),
                  onPressed: () => _handleSend(phrase),
                );
              },
            ),
          ),

          // Message Input Bar with Attach Button
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Attachment / Camera button
                  IconButton(
                    icon: const Icon(Icons.add_photo_alternate_outlined, color: AppColors.textSecondary),
                    tooltip: 'Send Photo or Video',
                    onPressed: _showMediaPicker,
                  ),
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      textInputAction: TextInputAction.send,
                      decoration: InputDecoration(
                        hintText: 'Type a message to ${widget.sellerName}...',
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(22),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                      ),
                      onSubmitted: (_) => _handleSend(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.primaryLime,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, size: 18, color: AppColors.textPrimary),
                      onPressed: () => _handleSend(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // Rich Message Bubble Renderer
  // =========================================================================
  Widget _buildMessageBubble(dynamic msg, bool isMe) {
    final String content = msg.content ?? '';
    final bool isOffer = content.contains('PRICE OFFER:');
    final bool isPhoto = content.contains('[PHOTO]:');
    final bool isVideo = content.contains('[VIDEO]:');

    if (isOffer) {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF3C7),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFCD34D), width: 1.5),
            boxShadow: [
              BoxShadow(
                color: Colors.amber.withOpacity(0.12),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text('🤝', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 6),
                  const Text(
                    'Formal Price Offer',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF92400E),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                content,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF78350F),
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 8),
              if (!isMe)
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        _handleSend('🤝 Offer accepted! Let\'s coordinate meetup.');
                      },
                      child: const Text('Accept', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                    ),
                    const SizedBox(width: 6),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryLime,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: _openMakeOfferSheet,
                      child: const Text('Counter', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                    ),
                  ],
                ),
              Align(
                alignment: Alignment.bottomRight,
                child: Text(
                  Formatters.formatTimeAgo(msg.createdAt),
                  style: TextStyle(
                    fontSize: 9,
                    color: const Color(0xFF92400E).withOpacity(0.7),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (isPhoto) {
      final filePath = content.replaceAll('📸 [PHOTO]:', '').trim();
      final isLocal = File(filePath).existsSync();

      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
          decoration: BoxDecoration(
            color: isMe ? AppColors.primaryLime : AppColors.surface,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                child: isLocal
                    ? Image.file(
                        File(filePath),
                        fit: BoxFit.cover,
                        height: 180,
                        width: double.infinity,
                      )
                    : CachedNetworkImage(
                        imageUrl: filePath,
                        fit: BoxFit.cover,
                        height: 180,
                        width: double.infinity,
                        placeholder: (_, __) => Container(
                          height: 180,
                          color: const Color(0xFFF1F5F9),
                          child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                        ),
                        errorWidget: (_, __, ___) => Container(
                          height: 180,
                          color: const Color(0xFFF1F5F9),
                          child: const Icon(Icons.broken_image, color: AppColors.textMuted),
                        ),
                      ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('📸 Shared Photo', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                    Text(
                      Formatters.formatTimeAgo(msg.createdAt),
                      style: const TextStyle(fontSize: 9, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (isVideo) {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
          decoration: BoxDecoration(
            color: isMe ? AppColors.primaryLime : AppColors.surface,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircleAvatar(
                radius: 16,
                backgroundColor: Colors.black12,
                child: Icon(Icons.play_arrow_rounded, color: Colors.black87),
              ),
              const SizedBox(width: 8),
              const Text('🎥 Video attachment', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      );
    }

    // Default Text Bubble
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isMe ? AppColors.primaryLime : AppColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: isMe ? AppColors.primaryLime : AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              content,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Align(
              alignment: Alignment.bottomRight,
              child: Text(
                Formatters.formatTimeAgo(msg.createdAt),
                style: const TextStyle(fontSize: 9, color: AppColors.textSecondary),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
