import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/utils/url_launcher_util.dart';
import '../../../data/models/listing_model.dart';
import '../../../data/repositories/listing_repository.dart';
import '../../../core/network/api_client.dart';
import '../../../state/auth_provider.dart';
import '../../../state/chat_provider.dart';
import '../../widgets/condition_badge.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/make_offer_modal.dart';
import '../../widgets/image_lightbox.dart';
import '../../widgets/campus_listing_card.dart';
import '../chats/chat_window_screen.dart';
import '../auth/auth_screen.dart';

class ListingDetailScreen extends StatefulWidget {
  final String listingId;

  const ListingDetailScreen({super.key, required this.listingId});

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  ListingModel? _listing;
  List<ListingModel> _related = [];
  bool _isLoading = true;
  bool _isDetailsExpanded = false;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchDetail();
  }

  void _fetchDetail() async {
    setState(() => _isLoading = true);
    final repo = ListingRepository(ApiClient());
    final item = await repo.getListingById(widget.listingId);
    final relatedItems = await repo.getListings(limit: 6, sortBy: 'popular');

    if (mounted) {
      setState(() {
        _listing = item;
        _related = relatedItems.where((i) => i.id != widget.listingId).toList();
        _isLoading = false;
      });
    }
  }

  void _handleStartChat() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const AuthScreen()));
      return;
    }

    final chatProv = Provider.of<ChatProvider>(context, listen: false);
    final conversationId = await chatProv.startChat(widget.listingId);

    if (conversationId != null && mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChatWindowScreen(
            conversationId: conversationId,
            sellerName: _listing?.seller?.name ?? 'Seller',
            itemTitle: _listing?.title ?? '',
          ),
        ),
      );
    }
  }

  void _handleWhatsApp() {
    if (_listing == null) return;
    final phone = _listing!.seller?.phone ?? '919315096256';
    final msg =
        'Hi ${_listing!.seller?.name ?? "there"}! I saw your listing on DTU Bazaar: "${_listing!.title}" (${Formatters.formatPrice(_listing!.price)}). Is it still available to meet on campus?';
    UrlLauncherUtil.openWhatsApp(phone: phone, message: msg);
  }

  void _handleMakeOffer() {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const AuthScreen()));
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => MakeOfferModal(
        originalPrice: _listing!.price,
        listingTitle: _listing!.title,
        onSubmitOffer: (offeredPrice, message) async {
          final chatProv = Provider.of<ChatProvider>(context, listen: false);
          final convId = await chatProv.startChat(widget.listingId);
          if (convId != null) {
            await chatProv.openConversation(convId);
            final offerMsg =
                '🤝 PRICE OFFER: ₹$offeredPrice (Listed at ₹${_listing!.price})${message.isNotEmpty ? "\nNote: $message" : ""}';
            await chatProv.sendMessage(offerMsg);
            if (mounted) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChatWindowScreen(
                    conversationId: convId,
                    sellerName: _listing?.seller?.name ?? 'Seller',
                    itemTitle: _listing?.title ?? '',
                  ),
                ),
              );
            }
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.emeraldPrimary)),
      );
    }

    if (_listing == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Listing not found or sold.')),
      );
    }

    final images = _listing!.images.isNotEmpty
        ? _listing!.images
        : [ListingImageModel(id: '', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80')];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          _listing!.title,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: const Border(top: BorderSide(color: AppColors.border)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Price', style: TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w700)),
                  Text(
                    Formatters.formatPrice(_listing!.price),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                  ),
                ],
              ),
              const Spacer(),
              // Offer Button
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
                onPressed: _handleMakeOffer,
                icon: const Text('🤝', style: TextStyle(fontSize: 14)),
                label: const Text('Offer', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
              ),
              const SizedBox(width: 8),
              // WhatsApp Button
              GestureDetector(
                onTap: _handleWhatsApp,
                child: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF25D366).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF25D366).withOpacity(0.3)),
                  ),
                  child: const Text('💬', style: TextStyle(fontSize: 16)),
                ),
              ),
              const SizedBox(width: 8),
              // Chat Button
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryLime,
                  foregroundColor: AppColors.textPrimary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                onPressed: _handleStartChat,
                icon: const Icon(Icons.chat_bubble_outline, size: 15),
                label: const Text('Chat', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900)),
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Photo Carousel with Lightbox trigger
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                AspectRatio(
                  aspectRatio: 16 / 11,
                  child: PageView.builder(
                    itemCount: images.length,
                    onPageChanged: (i) => setState(() => _currentImageIndex = i),
                    itemBuilder: (context, idx) {
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ImageLightbox(
                                images: images,
                                initialIndex: _currentImageIndex,
                              ),
                            ),
                          );
                        },
                        child: CachedNetworkImage(
                          imageUrl: images[idx].url,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Container(color: const Color(0xFFF1F5F9)),
                          errorWidget: (_, __, ___) => Container(color: const Color(0xFFF1F5F9)),
                        ),
                      );
                    },
                  ),
                ),
                if (images.length > 1)
                  Container(
                    margin: const EdgeInsets.all(12),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.65),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${_currentImageIndex + 1} / ${images.length}',
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                  ),
              ],
            ),

            // 2. Main Title & Meta Card
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          Formatters.getCategoryName(_listing!.category),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ConditionBadge(condition: _listing!.condition),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _listing!.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: AppColors.textPrimary,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 15, color: Colors.redAccent),
                      const SizedBox(width: 4),
                      Text(
                        _listing!.campusLocation ?? 'DTU Campus',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.access_time, size: 14, color: AppColors.emeraldPrimary),
                      const SizedBox(width: 4),
                      Text(
                        Formatters.formatTimeAgo(_listing!.createdAt),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 3. Item Description & Specs with Collapsible Button
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.description_outlined, size: 18, color: AppColors.emeraldPrimary),
                          SizedBox(width: 6),
                          Text(
                            'Item Details & Description',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () => setState(() => _isDetailsExpanded = !_isDetailsExpanded),
                        child: Text(
                          _isDetailsExpanded ? 'Hide' : 'View Full',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.emeraldPrimary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _listing!.description,
                    style: const TextStyle(fontSize: 12, height: 1.5, color: AppColors.textPrimary),
                    maxLines: _isDetailsExpanded ? null : 2,
                    overflow: _isDetailsExpanded ? TextOverflow.visible : TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 4. Seller Info Card
            if (_listing!.seller != null)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 22,
                      backgroundColor: AppColors.limeLight,
                      child: Text(
                        _listing!.seller!.name.substring(0, 1).toUpperCase(),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                _listing!.seller!.name,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'Verified DTU',
                                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.blueAccent),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${_listing!.seller!.branch ?? "DTU"} • ${_listing!.seller!.hostel ?? "Campus"}',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 24),

            // 5. Recommended Deals Carousel
            if (_related.isNotEmpty) ...[
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  '💡 Recommended Campus Deals',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 240,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _related.length,
                  itemBuilder: (context, idx) {
                    final item = _related[idx];
                    return Container(
                      width: 190,
                      margin: const EdgeInsets.only(right: 12),
                      child: CampusListingCard(
                        listing: item,
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ListingDetailScreen(listingId: item.id),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
