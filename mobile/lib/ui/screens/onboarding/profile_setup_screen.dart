import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/categories.dart';
import '../../../state/auth_provider.dart';
import '../../widgets/custom_button.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _roomController = TextEditingController();

  String _selectedBranch = CampusConstants.dtuBranches.first;
  String _selectedYear = CampusConstants.dtuYears[1]; // 2nd Year
  String _selectedHostel = CampusConstants.dtuHostels.first;
  String _userType = 'HOSTELER';

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      if (user.branch != null && user.branch!.isNotEmpty) _selectedBranch = user.branch!;
      if (user.year != null && user.year!.isNotEmpty) _selectedYear = user.year!;
      if (user.hostel != null && user.hostel!.isNotEmpty) _selectedHostel = user.hostel!;
      if (user.phone != null) _phoneController.text = user.phone!;
      if (user.roomNumber != null) _roomController.text = user.roomNumber!;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _roomController.dispose();
    super.dispose();
  }

  void _handleSave() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.updateProfile({
      'name': name,
      'branch': _selectedBranch,
      'year': _selectedYear,
      'userType': _userType,
      'hostel': _selectedHostel,
      'roomNumber': _roomController.text.trim(),
      'phone': _phoneController.text.trim(),
    });

    if (success && mounted) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Complete Your Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'DTU Campus Credentials',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            const Text(
              'This info builds peer trust when trading books, coolers & gadgets.',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),

            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full Name', hintText: 'e.g. Rohan Sharma'),
            ),
            const SizedBox(height: 16),

            // Branch Dropdown
            DropdownButtonFormField<String>(
              value: _selectedBranch,
              isExpanded: true,
              decoration: const InputDecoration(labelText: 'Engineering Branch'),
              items: CampusConstants.dtuBranches.map((b) {
                return DropdownMenuItem(value: b, child: Text(b, style: const TextStyle(fontSize: 12)));
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedBranch = val);
              },
            ),
            const SizedBox(height: 16),

            // Year & Hosteler Type Row
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedYear,
                    decoration: const InputDecoration(labelText: 'Academic Year'),
                    items: CampusConstants.dtuYears.map((y) {
                      return DropdownMenuItem(value: y, child: Text(y, style: const TextStyle(fontSize: 12)));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedYear = val);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _userType,
                    decoration: const InputDecoration(labelText: 'Student Type'),
                    items: const [
                      DropdownMenuItem(value: 'HOSTELER', child: Text('Hosteler', style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: 'DAY_SCHOLAR', child: Text('Day Scholar', style: TextStyle(fontSize: 12))),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _userType = val);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Hostel Dropdown
            DropdownButtonFormField<String>(
              value: _selectedHostel,
              isExpanded: true,
              decoration: const InputDecoration(labelText: 'Campus Residence / Hostel'),
              items: CampusConstants.dtuHostels.map((h) {
                return DropdownMenuItem(value: h, child: Text(h, style: const TextStyle(fontSize: 12)));
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedHostel = val);
              },
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _roomController,
              decoration: const InputDecoration(labelText: 'Room Number (Optional)', hintText: 'e.g. A-214'),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'WhatsApp Phone Number',
                hintText: 'e.g. +91 98765 43210',
                prefixIcon: Icon(Icons.phone_outlined, color: AppColors.textMuted),
              ),
            ),
            const SizedBox(height: 28),

            CustomButton(
              text: 'Save & Enter DTU Bazaar',
              width: double.infinity,
              isLoading: auth.isLoading,
              onPressed: _handleSave,
            ),
          ],
        ),
      ),
    );
  }
}
