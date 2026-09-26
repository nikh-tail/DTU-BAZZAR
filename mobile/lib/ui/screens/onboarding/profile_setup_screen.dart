import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/categories.dart';
import '../../../state/auth_provider.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController();

  String _selectedBranch = CampusConstants.dtuBranches.first;
  String _selectedYear = CampusConstants.dtuYears[1]; // 2nd Year
  String _selectedHostel = CampusConstants.dtuHostels.first;
  String _userType = 'HOSTELER';

  bool _isConfirmed = false;
  String _errorMessage = '';

  // Design Tokens
  static const Color deepInkBg = Color(0xFF0B0D12);
  static const Color glassSurface = Color(0x14FFFFFF);
  static const Color glassBorder = Color(0x24FFFFFF);
  static const Color dropdownBg = Color(0xFF141821);
  static const Color textPrimary = Color(0xFFEDEFF3);
  static const Color textMuted = Color(0xFF8A93A3);
  static const Color textSecondaryMuted = Color(0xFF6B7688);
  static const Color accentAmber = Color(0xFFE8A23D);
  static const Color accentDarkInk = Color(0xFF241705);
  static const Color successGreen = Color(0xFF34D399);
  static const Color errorRed = Color(0xFFFF5C5C);

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      if (user.branch != null && user.branch!.isNotEmpty) _selectedBranch = user.branch!;
      if (user.year != null && user.year!.isNotEmpty) _selectedYear = user.year!;
      if (user.hostel != null && user.hostel!.isNotEmpty) _selectedHostel = user.hostel!;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _handleFinishSetup() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _errorMessage = 'Please enter your full name.');
      return;
    }
    setState(() {
      _errorMessage = '';
      _isConfirmed = true;
    });
  }

  void _handleEnterApp() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    await auth.updateProfile({
      'name': _nameController.text.trim(),
      'branch': _selectedBranch,
      'year': _selectedYear,
      'userType': _userType,
      'hostel': _userType == 'HOSTELER' ? _selectedHostel : null,
    });

    if (mounted) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final userInitial = (_nameController.text.trim().isNotEmpty
            ? _nameController.text.trim().substring(0, 1)
            : 'U')
        .toUpperCase();

    return Scaffold(
      backgroundColor: deepInkBg,
      body: Stack(
        children: [
          // Dual Ambient Radial-Gradient Glows (amber top-left, green top-right)
          Positioned(
            top: -60,
            left: -60,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    accentAmber.withOpacity(0.14),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: -40,
            right: -60,
            child: Container(
              width: 340,
              height: 340,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    successGreen.withOpacity(0.12),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 440),
                  padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 30),
                  decoration: BoxDecoration(
                    color: glassSurface,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: glassBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 40,
                        offset: const Offset(0, 20),
                      ),
                    ],
                  ),
                  child: !_isConfirmed
                      ? _buildCampusIdentityStep()
                      : _buildConfirmationStep(userInitial, auth.isLoading),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCampusIdentityStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Campus identity',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Set up your student profile to trade and connect with peers.',
          style: TextStyle(fontSize: 12, color: textMuted),
        ),
        const SizedBox(height: 22),

        if (_errorMessage.isNotEmpty) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: errorRed.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: errorRed),
            ),
            child: Text(
              _errorMessage,
              style: const TextStyle(fontSize: 12, color: errorRed, fontWeight: FontWeight.w500),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // 1. Full name
        const Text(
          'Full name',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: textMuted),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _nameController,
          style: const TextStyle(fontSize: 14, color: textPrimary),
          decoration: InputDecoration(
            hintText: 'e.g. Rohan Sharma',
            hintStyle: const TextStyle(color: Color(0xFF5A6270), fontSize: 14),
            filled: true,
            fillColor: glassSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: accentAmber, width: 2),
            ),
          ),
        ),
        const SizedBox(height: 14),

        // 2. Branch / course
        const Text(
          'Branch / course',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: textMuted),
        ),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          value: _selectedBranch,
          isExpanded: true,
          dropdownColor: dropdownBg,
          style: const TextStyle(fontSize: 12, color: textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: glassSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: accentAmber, width: 2),
            ),
          ),
          items: CampusConstants.dtuBranches.map((b) {
            return DropdownMenuItem(value: b, child: Text(b, overflow: TextOverflow.ellipsis));
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedBranch = val);
          },
        ),
        const SizedBox(height: 14),

        // 3. Academic year
        const Text(
          'Academic year',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: textMuted),
        ),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          value: _selectedYear,
          isExpanded: true,
          dropdownColor: dropdownBg,
          style: const TextStyle(fontSize: 12, color: textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: glassSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: glassBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: accentAmber, width: 2),
            ),
          ),
          items: CampusConstants.dtuYears.map((y) {
            return DropdownMenuItem(value: y, child: Text(y));
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedYear = val);
          },
        ),
        const SizedBox(height: 14),

        // 4. Residence type — Two-option toggle
        const Text(
          'Residence type',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: textMuted),
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _userType = 'HOSTELER'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: _userType == 'HOSTELER'
                        ? accentAmber.withOpacity(0.12)
                        : glassSurface,
                    borderRadius: BorderRadius.circular(9),
                    border: Border.all(
                      color: _userType == 'HOSTELER' ? accentAmber : glassBorder,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      '🏢 Hosteler',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _userType == 'HOSTELER' ? accentAmber : textMuted,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _userType = 'DAY_SCHOLAR'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: _userType == 'DAY_SCHOLAR'
                        ? accentAmber.withOpacity(0.12)
                        : glassSurface,
                    borderRadius: BorderRadius.circular(9),
                    border: Border.all(
                      color: _userType == 'DAY_SCHOLAR' ? accentAmber : glassBorder,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      '🚗 Day scholar',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _userType == 'DAY_SCHOLAR' ? accentAmber : textMuted,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),

        // 5. Hostel selection — Only visible when Hosteler is selected
        if (_userType == 'HOSTELER') ...[
          const SizedBox(height: 14),
          const Text(
            'Hostel name',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: textMuted),
          ),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            value: _selectedHostel,
            isExpanded: true,
            dropdownColor: dropdownBg,
            style: const TextStyle(fontSize: 12, color: textPrimary),
            decoration: InputDecoration(
              filled: true,
              fillColor: glassSurface,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: glassBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: glassBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: accentAmber, width: 2),
              ),
            ),
            items: CampusConstants.dtuHostels.map((h) {
              return DropdownMenuItem(value: h, child: Text(h, overflow: TextOverflow.ellipsis));
            }).toList(),
            onChanged: (val) {
              if (val != null) setState(() => _selectedHostel = val);
            },
          ),
        ],

        const SizedBox(height: 24),

        // Finish setup primary button (full width)
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _handleFinishSetup,
            style: ElevatedButton.styleFrom(
              backgroundColor: accentAmber,
              foregroundColor: accentDarkInk,
              elevation: 0,
              shape: RoundedCornerShape(9),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Finish setup',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: accentDarkInk),
                ),
                SizedBox(width: 6),
                Icon(Icons.arrow_forward, size: 16, color: accentDarkInk),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildConfirmationStep(String userInitial, bool isLoading) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Small square avatar tile showing initial in green
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: successGreen.withOpacity(0.12),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: successGreen),
            boxShadow: [
              BoxShadow(
                color: successGreen.withOpacity(0.25),
                blurRadius: 20,
              ),
            ],
          ),
          child: Center(
            child: Text(
              userInitial,
              style: const TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w800,
                color: successGreen,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Full name heading
        Text(
          _nameController.text.trim(),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textPrimary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),

        // Branch + Year line
        Text(
          '$_selectedBranch • $_selectedYear',
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 2),

        // Hostel / Day scholar line
        Text(
          _userType == 'HOSTELER' ? '🏢 $_selectedHostel' : '🚗 Day scholar',
          style: const TextStyle(
            fontSize: 11,
            color: textSecondaryMuted,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),

        // Reassurance note line
        const Text(
          'Your campus profile is ready. You can now browse verified listings, message campus peers, and post items with 0% brokerage.',
          style: TextStyle(
            fontSize: 12,
            color: textMuted,
            height: 1.4,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),

        // Enter DTU Bazaar primary button
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: isLoading ? null : _handleEnterApp,
            style: ElevatedButton.styleFrom(
              backgroundColor: accentAmber,
              foregroundColor: accentDarkInk,
              elevation: 0,
              shape: RoundedCornerShape(9),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  isLoading ? 'Entering...' : 'Enter DTU Bazaar',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: accentDarkInk),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.arrow_forward, size: 16, color: accentDarkInk),
              ],
            ),
          ),
        ),
      ],
    );
  }

  RoundedCornerShape(int i) {}
}
