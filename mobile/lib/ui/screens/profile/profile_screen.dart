import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../state/auth_provider.dart';
import '../../../state/listing_provider.dart';
import '../../widgets/campus_listing_card.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/empty_state.dart';
import '../auth/auth_screen.dart';
import '../onboarding/profile_setup_screen.dart';
import '../listing_detail/listing_detail_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (auth.isAuthenticated) {
        Provider.of<ListingProvider>(context, listen: false).fetchMyListings();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showProUpgradeModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFCD34D)),
                ),
                child: const Text(
                  '🌟 DTU Campus Pro Seller',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF92400E)),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Upgrade for ₹10 (One-time)',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 6),
              const Text(
                'Unlock unlimited active listings and Pro Seller verified badge on all your items.',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              QrImageView(
                data: 'upi://pay?pa=9315096256@ptyes&pn=DTUBazaar&am=10&cu=INR&tn=ProUpgrade',
                version: QrVersions.auto,
                size: 160.0,
              ),
              const SizedBox(height: 8),
              const Text('Scan & Pay ₹10 to 9315096256@ptyes', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              const SizedBox(height: 20),
              CustomButton(
                text: 'Done Payment',
                width: double.infinity,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final listingProv = Provider.of<ListingProvider>(context);

    if (!auth.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('DTU Profile')),
        body: EmptyState(
          title: 'Join DTU Campus Bazaar',
          description: 'Log in with your DTU student webmail to manage your listings and profile.',
          actionText: 'Log In / Sign Up',
          onAction: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const AuthScreen()));
          },
        ),
      );
    }

    final user = auth.user!;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Campus Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, size: 20, color: AppColors.error),
            onPressed: () => auth.logout(),
          ),
        ],
      ),
      body: Column(
        children: [
          // User Info Header Card
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: AppColors.limeLight,
                      child: Text(
                        user.name.substring(0, 1).toUpperCase(),
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                user.name,
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                              ),
                              const SizedBox(width: 6),
                              if (user.isProSeller)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFEF3C7),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text('PRO 🌟', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Color(0xFF92400E))),
                                )
                              else
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEFF6FF),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text('Verified', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.blueAccent)),
                                ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(user.email, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                          const SizedBox(height: 2),
                          Text(
                            '${user.branch ?? "DTU Branch"} • ${user.hostel ?? "Hostel"}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          padding: const EdgeInsets.symmetric(vertical: 8),
                        ),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ProfileSetupScreen()),
                          );
                        },
                        child: const Text('Edit Profile', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                      ),
                    ),
                    if (!user.isProSeller) ...[
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryLime,
                            foregroundColor: AppColors.textPrimary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                          onPressed: _showProUpgradeModal,
                          child: const Text('Upgrade Pro (₹10)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // 3 Tabs (Active, Sold, Saved)
          Container(
            color: AppColors.surface,
            child: TabBar(
              controller: _tabController,
              labelColor: AppColors.textPrimary,
              unselectedLabelColor: AppColors.textSecondary,
              indicatorColor: AppColors.primaryLime,
              indicatorWeight: 3,
              labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
              tabs: [
                Tab(text: 'Active (${listingProv.myActiveListings.length})'),
                Tab(text: 'Sold (${listingProv.mySoldListings.length})'),
                Tab(text: 'Saved (${listingProv.mySavedListings.length})'),
              ],
            ),
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Active listings
                listingProv.myActiveListings.isEmpty
                    ? const EmptyState(
                        title: 'No active listings',
                        description: 'Post your unused books, cycles, or gadgets for juniors.',
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: listingProv.myActiveListings.length,
                        itemBuilder: (context, idx) {
                          final item = listingProv.myActiveListings[idx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ListTile(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => ListingDetailScreen(listingId: item.id)),
                                );
                              },
                              title: Text(item.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                              subtitle: Text(Formatters.formatPrice(item.price), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.emeraldPrimary)),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  TextButton(
                                    onPressed: () => listingProv.markSold(item.id),
                                    child: const Text('Mark Sold', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.error),
                                    onPressed: () => listingProv.deleteListing(item.id),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),

                // Sold items
                listingProv.mySoldListings.isEmpty
                    ? const EmptyState(
                        title: 'No sold items yet',
                        description: 'Items you mark as sold will appear here for your track record.',
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: listingProv.mySoldListings.length,
                        itemBuilder: (context, idx) {
                          final item = listingProv.mySoldListings[idx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ListTile(
                              title: Text(item.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                              subtitle: Text(Formatters.formatPrice(item.price)),
                              trailing: const Text('✅ Completed', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.emeraldPrimary)),
                            ),
                          );
                        },
                      ),

                // Saved Wishlist
                listingProv.mySavedListings.isEmpty
                    ? const EmptyState(
                        title: 'No saved items',
                        description: 'Tap the heart icon on any listing to save it here.',
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: listingProv.mySavedListings.length,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.72,
                        ),
                        itemBuilder: (context, index) {
                          final item = listingProv.mySavedListings[index];
                          return CampusListingCard(
                            listing: item,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => ListingDetailScreen(listingId: item.id)),
                              );
                            },
                            onToggleSave: () => listingProv.toggleSave(item.id),
                          );
                        },
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
