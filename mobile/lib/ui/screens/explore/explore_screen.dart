import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/categories.dart';
import '../../../state/listing_provider.dart';
import '../../widgets/campus_listing_card.dart';
import '../../widgets/empty_state.dart';
import '../listing_detail/listing_detail_screen.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final listingProv = Provider.of<ListingProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Campus Marketplace'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (val) => listingProv.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'Search title, brand, specs, hostel...',
                prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.textMuted),
                suffixIcon: listingProv.searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () => listingProv.setSearchQuery(''),
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              ),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Horizontal Category Chip Filter Row
          Container(
            height: 48,
            color: AppColors.surface,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              children: [
                _buildCategoryChip(
                  context,
                  label: '⚡ All Items',
                  isSelected: listingProv.selectedCategory == 'ALL',
                  onTap: () => listingProv.setCategory('ALL'),
                ),
                ...CampusConstants.categories.map((cat) {
                  return _buildCategoryChip(
                    context,
                    label: '${cat.icon} ${cat.shortName}',
                    isSelected: listingProv.selectedCategory == cat.id,
                    onTap: () => listingProv.setCategory(cat.id),
                  );
                }),
              ],
            ),
          ),

          const Divider(height: 1, color: AppColors.border),

          // Main Listings Grid
          Expanded(
            child: listingProv.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.emeraldPrimary))
                : listingProv.listings.isEmpty
                    ? EmptyState(
                        title: 'No listings found',
                        description: 'Try adjusting your search terms or clearing your category filters.',
                        actionText: 'Clear Filters',
                        onAction: () => listingProv.resetFilters(),
                      )
                    : RefreshIndicator(
                        onRefresh: () => listingProv.fetchListings(),
                        color: AppColors.emeraldPrimary,
                        child: GridView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: listingProv.listings.length,
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 0.72,
                          ),
                          itemBuilder: (context, index) {
                            final item = listingProv.listings[index];
                            return CampusListingCard(
                              listing: item,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => ListingDetailScreen(listingId: item.id),
                                  ),
                                );
                              },
                              onToggleSave: () => listingProv.toggleSave(item.id),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(
    BuildContext context, {
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
          ),
        ),
        selected: isSelected,
        selectedColor: AppColors.primaryLime,
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: isSelected ? AppColors.primaryLime : AppColors.border,
          ),
        ),
        onSelected: (_) => onTap(),
      ),
    );
  }
}
