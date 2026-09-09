import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/categories.dart';
import '../../../state/auth_provider.dart';
import '../../../state/listing_provider.dart';
import '../../../data/repositories/listing_repository.dart';
import '../../../core/network/api_client.dart';
import '../../widgets/custom_button.dart';
import '../auth/auth_screen.dart';

class SellWizardScreen extends StatefulWidget {
  const SellWizardScreen({super.key});

  @override
  State<SellWizardScreen> createState() => _SellWizardScreenState();
}

class _SellWizardScreenState extends State<SellWizardScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();

  String _selectedCategory = CampusConstants.categories.first.id;
  String _selectedCondition = 'LIKE_NEW';
  final List<XFile> _selectedImages = [];
  bool _isPosting = false;

  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _priceController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _pickImages() async {
    try {
      final images = await _picker.pickMultiImage(imageQuality: 85);
      if (images.isNotEmpty) {
        setState(() {
          _selectedImages.addAll(images);
        });
      }
    } catch (e) {
      print('Image picker error: $e');
    }
  }

  void _takePhoto() async {
    try {
      final photo = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
      if (photo != null) {
        setState(() {
          _selectedImages.add(photo);
        });
      }
    } catch (e) {
      print('Camera error: $e');
    }
  }

  void _handleSubmit() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const AuthScreen()));
      return;
    }

    final listingProv = Provider.of<ListingProvider>(context, listen: false);
    await listingProv.fetchMyListings();

    // Check free limit (3 listings max for free tier)
    final isPro = auth.user?.isProSeller ?? false;
    if (!isPro && listingProv.myActiveListings.length >= 3) {
      _showPaywallModal();
      return;
    }

    final title = _titleController.text.trim();
    final desc = _descController.text.trim();
    final price = num.tryParse(_priceController.text) ?? 0;

    if (title.isEmpty || desc.isEmpty || price <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields correctly.')),
      );
      return;
    }

    setState(() => _isPosting = true);

    // Fallback campus stock photo if no photos picked
    final imageUrls = _selectedImages.isNotEmpty
        ? [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
          ]
        : [
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
          ];

    final repo = ListingRepository(ApiClient());
    final success = await repo.createListing({
      'title': title,
      'description': desc,
      'price': price,
      'category': _selectedCategory,
      'condition': _selectedCondition,
      'campusLocation': _locationController.text.trim().isNotEmpty
          ? _locationController.text.trim()
          : (auth.user?.hostel ?? 'DTU Main Campus'),
      'imageUrls': imageUrls,
    });

    setState(() => _isPosting = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Listing posted successfully to DTU Bazaar!')),
      );
      listingProv.fetchInitialData();
      Navigator.pop(context);
    }
  }

  void _showPaywallModal() {
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
                  '🌟 Campus Pro Tier Required',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF92400E)),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Free Listing Limit Reached (3/3)',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 6),
              const Text(
                'Unlock unlimited active listings for just ₹10 via direct UPI QR.',
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
              const Text('UPI ID: 9315096256@ptyes', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              const SizedBox(height: 20),
              CustomButton(
                text: 'Done / Verification Request',
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
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Sell an Item on Campus'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Picker Section
            const Text(
              'Item Photos (Up to 5)',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 90,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  GestureDetector(
                    onTap: _pickImages,
                    child: Container(
                      width: 85,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_photo_alternate_outlined, size: 24, color: AppColors.emeraldPrimary),
                          SizedBox(height: 4),
                          Text('Add Photos', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _takePhoto,
                    child: Container(
                      width: 85,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt_outlined, size: 24, color: AppColors.emeraldPrimary),
                          SizedBox(height: 4),
                          Text('Camera', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                  ..._selectedImages.map((file) {
                    return Container(
                      width: 85,
                      margin: const EdgeInsets.only(left: 8),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        image: DecorationImage(
                          image: FileImage(File(file.path)),
                          fit: BoxFit.cover,
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Title
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Listing Title',
                hintText: 'e.g. Casio 991EX Calculator / Hero Sprint Cycle',
              ),
            ),
            const SizedBox(height: 14),

            // Price & Condition Row
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Price (₹)',
                      prefixText: '₹ ',
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedCondition,
                    decoration: const InputDecoration(labelText: 'Condition'),
                    items: const [
                      DropdownMenuItem(value: 'NEW', child: Text('Brand New', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'LIKE_NEW', child: Text('Like New', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'GOOD', child: Text('Good', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'FAIR', child: Text('Fair', style: TextStyle(fontSize: 12))),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCondition = val);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Category Dropdown
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: const InputDecoration(labelText: 'Campus Category'),
              items: CampusConstants.categories.map((c) {
                return DropdownMenuItem(
                  value: c.id,
                  child: Text('${c.icon} ${c.name}', style: const TextStyle(fontSize: 12)),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedCategory = val);
              },
            ),
            const SizedBox(height: 14),

            // Campus Handover Location
            TextField(
              controller: _locationController,
              decoration: const InputDecoration(
                labelText: 'Campus Handover Location',
                hintText: 'e.g. Aryabhatta Hostel / Mic-Mac / Mech Dept',
                prefixIcon: Icon(Icons.location_on_outlined, size: 20, color: Colors.redAccent),
              ),
            ),
            const SizedBox(height: 14),

            // Description
            TextField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Description & Item Specs',
                hintText: 'Describe condition, age, reasons for selling, and specs...',
              ),
              maxLines: 4,
            ),
            const SizedBox(height: 28),

            CustomButton(
              text: 'Publish Listing on DTU Bazaar',
              width: double.infinity,
              isLoading: _isPosting,
              onPressed: _handleSubmit,
            ),
          ],
        ),
      ),
    );
  }
}
