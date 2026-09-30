import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/categories.dart';
import '../../../state/auth_provider.dart';

enum OnboardingStep {
  emailInput, // Step 1 - Stage A
  otpInput,   // Step 1 - Stage B
  otpSuccess, // Step 1 - Stage C
  identity,   // Step 2 - Campus Identity
  confirmation, // Step 3 - Confirmation
}

enum OtpStatus {
  idle,
  correct,
  wrong,
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  // Step State
  OnboardingStep _currentStep = OnboardingStep.emailInput;
  OtpStatus _otpStatus = OtpStatus.idle;

  // Controllers & Focus Nodes
  final TextEditingController _emailController = TextEditingController();
  final List<TextEditingController> _otpControllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _otpFocusNodes = List.generate(6, (_) => FocusNode());

  // Step 2 Controllers
  final TextEditingController _nameController = TextEditingController();
  String _selectedBranch = CampusConstants.dtuBranches.first;
  String _selectedYear = CampusConstants.dtuYears[1]; // 2nd Year
  String _selectedHostel = CampusConstants.dtuHostels.first;
  String _userType = 'HOSTELER'; // 'HOSTELER' or 'DAY_SCHOLAR'

  // Loading & Error states
  bool _isLoading = false;
  String _errorMessage = '';

  // Shake animation controller
  late AnimationController _shakeController;
  late Animation<double> _shakeAnimation;

  // Design Tokens
  static const Color deepInkBg = Color(0xFF0B0D12);
  static const Color glassSurface = Color(0x0FFFFFFF); // rgba(255,255,255,0.06)
  static const Color glassBorder = Color(0x24FFFFFF); // rgba(255,255,255,0.14)
  static const Color flatSurface = Color(0xFF141821);
  static const Color flatBorder = Color(0xFF262C38);
  static const Color textPrimary = Color(0xFFEDEFF3);
  static const Color textMuted = Color(0xFF8A93A3);
  static const Color accentAmber = Color(0xFFE8A23D);
  static const Color accentDarkInk = Color(0xFF241705);
  static const Color successGreen = Color(0xFF34D399);
  static const Color errorRed = Color(0xFFFF5C5C);

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 380),
    );
    _shakeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _emailController.dispose();
    for (final c in _otpControllers) {
      c.dispose();
    }
    for (final f in _otpFocusNodes) {
      f.dispose();
    }
    _nameController.dispose();
    super.dispose();
  }

  // =========================================================================
  // STEP 1 - STAGE A: Send Verification Code
  // =========================================================================
  void _handleSendCode() async {
    final email = _emailController.text.trim().toLowerCase();
    if (!email.contains('@') || !email.contains('.')) {
      setState(() => _errorMessage = 'Please enter a valid email address.');
      return;
    }

    setState(() {
      _errorMessage = '';
      _isLoading = true;
    });

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.sendOtp(email);

    setState(() => _isLoading = false);

    if (success) {
      for (final c in _otpControllers) {
        c.clear();
      }
      setState(() {
        _currentStep = OnboardingStep.otpInput;
        _otpStatus = OtpStatus.idle;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _otpFocusNodes[0].requestFocus();
      });
    } else {
      setState(() => _errorMessage = 'Failed to send verification code. Please try again.');
    }
  }

  // =========================================================================
  // STEP 1 - STAGE B: OTP Input & Verification
  // =========================================================================
  void _onOtpDigitChanged(int index, String value) {
    setState(() => _errorMessage = '');

    if (value.isNotEmpty) {
      // If user pasted a 6-digit code or typed multiple characters
      if (value.length > 1) {
        final digits = value.replaceAll(RegExp(r'\D'), '');
        if (digits.length >= 6) {
          for (int i = 0; i < 6; i++) {
            _otpControllers[i].text = digits[i];
          }
          _otpFocusNodes[5].requestFocus();
          _triggerVerifyOtp(digits.substring(0, 6));
          return;
        }
      }

      // Keep only single numeric digit
      final char = value.substring(value.length - 1);
      _otpControllers[index].text = char;

      if (index < 5) {
        _otpFocusNodes[index + 1].requestFocus();
      }
    }

    // Check if all 6 boxes are filled
    final fullCode = _otpControllers.map((c) => c.text.trim()).join();
    if (fullCode.length == 6) {
      _triggerVerifyOtp(fullCode);
    }
  }

  void _triggerVerifyOtp(String code) async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final email = _emailController.text.trim().toLowerCase();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.verifyOtp(email, code);

    setState(() => _isLoading = false);

    if (success) {
      // Correct OTP entered: all 6 boxes green border + green glow
      setState(() => _otpStatus = OtpStatus.correct);

      final user = auth.user;
      final bool isFreshUser = (user == null ||
          user.branch == null ||
          user.branch!.isEmpty ||
          user.name.isEmpty ||
          user.name == email.split('@')[0]);

      if (user != null && user.name.isNotEmpty && user.name != email.split('@')[0]) {
        _nameController.text = user.name;
        if (user.branch != null && user.branch!.isNotEmpty) _selectedBranch = user.branch!;
        if (user.year != null && user.year!.isNotEmpty) _selectedYear = user.year!;
        if (user.hostel != null && user.hostel!.isNotEmpty) _selectedHostel = user.hostel!;
        if (user.userType != null && user.userType!.isNotEmpty) _userType = user.userType!;
      }

      // Transition to Stage C after ~450ms
      await Future.delayed(const Duration(milliseconds: 450));
      if (!mounted) return;

      setState(() => _currentStep = OnboardingStep.otpSuccess);

      // Stage C auto-advances to Step 2 (or Step 3 if existing user) after ~1.3s
      await Future.delayed(const Duration(milliseconds: 1300));
      if (!mounted) return;

      setState(() {
        if (isFreshUser) {
          _currentStep = OnboardingStep.identity;
        } else {
          _currentStep = OnboardingStep.confirmation;
        }
      });
    } else {
      // Wrong OTP: Red border + red glow, 380ms horizontal shake, clear & refocus
      setState(() => _otpStatus = OtpStatus.wrong);
      _shakeController.forward(from: 0.0);

      await Future.delayed(const Duration(milliseconds: 380));
      if (!mounted) return;

      for (final c in _otpControllers) {
        c.clear();
      }
      setState(() {
        _otpStatus = OtpStatus.idle;
        _errorMessage = 'Incorrect verification code. Please check your inbox or use 123456.';
      });
      _otpFocusNodes[0].requestFocus();
    }
  }

  // =========================================================================
  // STEP 2: Finish Campus Identity Setup
  // =========================================================================
  void _handleFinishIdentity() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _errorMessage = 'Please enter your full name.');
      return;
    }
    setState(() {
      _errorMessage = '';
      _currentStep = OnboardingStep.confirmation;
    });
  }

  // =========================================================================
  // STEP 3: Enter DTU Bazaar
  // =========================================================================
  void _handleEnterApp() async {
    setState(() => _isLoading = true);

    final auth = Provider.of<AuthProvider>(context, listen: false);
    await auth.updateProfile({
      'name': _nameController.text.trim(),
      'branch': _selectedBranch,
      'year': _selectedYear,
      'userType': _userType,
      'hostel': _userType == 'HOSTELER' ? _selectedHostel : null,
    });

    setState(() => _isLoading = false);

    if (mounted) {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final userInitial = (_nameController.text.trim().isNotEmpty
            ? _nameController.text.trim().substring(0, 1)
            : (_emailController.text.trim().isNotEmpty
                ? _emailController.text.trim().substring(0, 1)
                : 'U'))
        .toUpperCase();

    return Scaffold(
      backgroundColor: deepInkBg,
      body: Stack(
        children: [
          // Ambient Radial-Gradient Glow 1: Amber at top-left (~18% 12%)
          Positioned(
            top: -50,
            left: -50,
            child: IgnorePointer(
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    center: const Alignment(-0.64, -0.76),
                    radius: 0.65,
                    colors: [
                      accentAmber.withOpacity(0.14),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.42],
                  ),
                ),
              ),
            ),
          ),

          // Ambient Radial-Gradient Glow 2: Green at top-right (~88% 10%)
          Positioned(
            top: -40,
            right: -60,
            child: IgnorePointer(
              child: Container(
                width: 340,
                height: 340,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    center: const Alignment(0.76, -0.80),
                    radius: 0.65,
                    colors: [
                      successGreen.withOpacity(0.12),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.42],
                  ),
                ),
              ),
            ),
          ),

          // Dim Overlay Behind Centered Modal
          Container(
            color: const Color(0x8C050609), // rgba(5,6,9,0.55)
          ),

          // Centered Glass Card Content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: AnimatedBuilder(
                  animation: _shakeAnimation,
                  builder: (context, child) {
                    final shakeOffset = math.sin(_shakeAnimation.value * math.pi * 4) * 8.0;
                    return Transform.translate(
                      offset: Offset(shakeOffset, 0),
                      child: child,
                    );
                  },
                  child: Container(
                    constraints: const BoxConstraints(maxWidth: 440),
                    padding: const EdgeInsets.fromLTRB(26, 30, 26, 26),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0x1AFFFFFF), // rgba(255,255,255,0.10)
                          Color(0x08FFFFFF), // rgba(255,255,255,0.03)
                        ],
                        stops: [0.0, 1.0],
                      ),
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: glassBorder, width: 1),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.50),
                          blurRadius: 60,
                          offset: const Offset(0, 20),
                        ),
                      ],
                    ),
                    child: _buildCurrentStepContent(userInitial),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStepContent(String userInitial) {
    switch (_currentStep) {
      case OnboardingStep.emailInput:
        return _buildStageAEmailInput();
      case OnboardingStep.otpInput:
        return _buildStageBOtpInput();
      case OnboardingStep.otpSuccess:
        return _buildStageCOtpSuccess();
      case OnboardingStep.identity:
        return _buildStep2CampusIdentity();
      case OnboardingStep.confirmation:
        return _buildStep3Confirmation(userInitial);
    }
  }

  // =========================================================================
  // STEP 1 — STAGE A (Email Input)
  // =========================================================================
  Widget _buildStageAEmailInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          'Verify your email',
          style: GoogleFonts.sora(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Enter your email address to receive a 6-digit verification code. Any email (Gmail, Outlook, Yahoo, DTU webmail) is accepted.',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: textMuted,
            height: 1.4,
          ),
        ),
        const SizedBox(height: 24),

        if (_errorMessage.isNotEmpty) ...[
          _buildInlineErrorMessage(_errorMessage),
          const SizedBox(height: 16),
        ],

        // Sentence-case Label
        Text(
          'Email address',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
        ),
        const SizedBox(height: 6),

        // Glass Input Style
        TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: textPrimary,
          ),
          decoration: InputDecoration(
            hintText: 'e.g. nikhil@gmail.com or rollno@dtu.ac.in',
            hintStyle: GoogleFonts.inter(
              color: const Color(0xFF5A6270),
              fontSize: 13,
            ),
            filled: true,
            fillColor: glassSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0x28FFFFFF)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0x28FFFFFF)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: accentAmber, width: 2),
            ),
          ),
          onSubmitted: (_) => _handleSendCode(),
        ),
        const SizedBox(height: 24),

        // Primary Button: "Send code"
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _handleSendCode,
            style: ElevatedButton.styleFrom(
              backgroundColor: accentAmber,
              foregroundColor: accentDarkInk,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(9),
              ),
            ),
            child: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(accentDarkInk),
                    ),
                  )
                : Text(
                    'Send code',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: accentDarkInk,
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  // =========================================================================
  // STEP 1 — STAGE B (4 Separate OTP Boxes)
  // =========================================================================
  Widget _buildStageBOtpInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Enter the code',
              style: GoogleFonts.sora(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: textPrimary,
              ),
            ),
            GestureDetector(
              onTap: () {
                setState(() {
                  _currentStep = OnboardingStep.emailInput;
                  _errorMessage = '';
                });
              },
              child: Text(
                'Change',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: accentAmber,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          'We sent a 6-digit code to ${_emailController.text.trim()} (or enter master code 123456)',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: textMuted,
            height: 1.4,
          ),
        ),
        const SizedBox(height: 28),

        // 6 Separate Single-Digit OTP Boxes (44x54px, 12px radius, black digit on white surface)
        Center(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(6, (index) => _buildOtpDigitBox(index)),
            ),
          ),
        ),

        const SizedBox(height: 16),

        if (_errorMessage.isNotEmpty) ...[
          _buildInlineErrorMessage(_errorMessage),
          const SizedBox(height: 16),
        ],

        // Resend Code secondary action
        Center(
          child: TextButton(
            onPressed: _isLoading ? null : _handleSendCode,
            child: Text(
              'Didn\'t receive code? Resend code',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: textMuted,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOtpDigitBox(int index) {
    Color borderColor = const Color(0x33000000);
    List<BoxShadow> boxShadows = [
      BoxShadow(
        color: Colors.black.withOpacity(0.08),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ];

    if (_otpStatus == OtpStatus.correct) {
      borderColor = successGreen;
      boxShadows = [
        const BoxShadow(
          color: Color(0xA634D399), // 0 0 22px rgba(52,211,153,.65)
          blurRadius: 22,
          spreadRadius: 1,
        ),
      ];
    } else if (_otpStatus == OtpStatus.wrong) {
      borderColor = errorRed;
      boxShadows = [
        const BoxShadow(
          color: Color(0x8CFF5C5C), // 0 0 22px rgba(255,92,92,.55)
          blurRadius: 22,
          spreadRadius: 1,
        ),
      ];
    }

    return Container(
      width: 44,
      height: 54,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor, width: 2),
        boxShadow: boxShadows,
      ),
      child: Center(
        child: RawKeyboardListener(
          focusNode: FocusNode(),
          onKey: (event) {
            if (event is RawKeyDownEvent &&
                event.logicalKey == LogicalKeyboardKey.backspace &&
                _otpControllers[index].text.isEmpty &&
                index > 0) {
              _otpFocusNodes[index - 1].requestFocus();
            }
          },
          child: TextField(
            controller: _otpControllers[index],
            focusNode: _otpFocusNodes[index],
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            maxLength: 1,
            cursorColor: Colors.black,
            style: GoogleFonts.sora(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Colors.black, // Explicitly black as requested by user
            ),
            decoration: const InputDecoration(
              counterText: '',
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              contentPadding: EdgeInsets.zero,
              filled: true,
              fillColor: Colors.white,
            ),
            onChanged: (val) => _onOtpDigitChanged(index, val),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // STEP 1 — STAGE C (Verified Successfully)
  // =========================================================================
  Widget _buildStageCOtpSuccess() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 12),
        // Green checkmark tile (74x74px, 18px radius, green bg/border/glow)
        Container(
          width: 74,
          height: 74,
          decoration: BoxDecoration(
            color: successGreen.withOpacity(0.12),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: successGreen, width: 2),
            boxShadow: [
              BoxShadow(
                color: successGreen.withOpacity(0.35),
                blurRadius: 26,
                spreadRadius: 2,
              ),
            ],
          ),
          child: const Center(
            child: Icon(
              Icons.check_rounded,
              color: successGreen,
              size: 40,
            ),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Verified successfully',
          style: GoogleFonts.sora(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          'Setting up your campus identity...',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: textMuted,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 18),
      ],
    );
  }

  // =========================================================================
  // STEP 2 — CAMPUS IDENTITY (Consolidated Single Glass Card)
  // =========================================================================
  Widget _buildStep2CampusIdentity() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          'Campus identity',
          style: GoogleFonts.sora(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Tell us a bit about yourself to personalize your campus marketplace.',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: textMuted,
            height: 1.4,
          ),
        ),
        const SizedBox(height: 22),

        if (_errorMessage.isNotEmpty) ...[
          _buildInlineErrorMessage(_errorMessage),
          const SizedBox(height: 16),
        ],

        // 1. Full name
        Text(
          'Full name',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _nameController,
          style: GoogleFonts.inter(fontSize: 14, color: textPrimary),
          decoration: InputDecoration(
            hintText: 'e.g. Rohan Sharma',
            hintStyle: GoogleFonts.inter(color: const Color(0xFF5A6270), fontSize: 13),
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
        Text(
          'Branch / course',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
        ),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          value: _selectedBranch,
          isExpanded: true,
          dropdownColor: flatSurface,
          style: GoogleFonts.inter(fontSize: 13, color: textPrimary),
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
        Text(
          'Academic year',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
        ),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          value: _selectedYear,
          isExpanded: true,
          dropdownColor: flatSurface,
          style: GoogleFonts.inter(fontSize: 13, color: textPrimary),
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
        Text(
          'Residence type',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
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
                      style: GoogleFonts.inter(
                        fontSize: 13,
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
                      style: GoogleFonts.inter(
                        fontSize: 13,
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
          Text(
            'Hostel name',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: textMuted,
            ),
          ),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            value: _selectedHostel,
            isExpanded: true,
            dropdownColor: flatSurface,
            style: GoogleFonts.inter(fontSize: 13, color: textPrimary),
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

        // Single "Finish setup" primary button (full width)
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _handleFinishIdentity,
            style: ElevatedButton.styleFrom(
              backgroundColor: accentAmber,
              foregroundColor: accentDarkInk,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(9),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Finish setup',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: accentDarkInk,
                  ),
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

  // =========================================================================
  // STEP 3 — CONFIRMATION (Centered Glass Card)
  // =========================================================================
  Widget _buildStep3Confirmation(String userInitial) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Small square avatar tile showing user's initial in green
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: successGreen.withOpacity(0.12),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: successGreen, width: 1.5),
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
              style: GoogleFonts.sora(
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
          _nameController.text.trim().isNotEmpty
              ? _nameController.text.trim()
              : 'Campus Student',
          style: GoogleFonts.sora(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),

        // Branch + Year line (muted)
        Text(
          '$_selectedBranch • $_selectedYear',
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: textMuted,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 2),

        // Hostel or Day scholar line (more muted)
        Text(
          _userType == 'HOSTELER' ? '🏢 $_selectedHostel' : '🚗 Day scholar',
          style: GoogleFonts.inter(
            fontSize: 12,
            color: const Color(0xFF6B7688),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),

        // Reassurance note
        Text(
          'Your campus profile is ready. You can now browse verified listings, message campus peers, and post items with 0% brokerage.',
          style: GoogleFonts.inter(
            fontSize: 12,
            color: textMuted,
            height: 1.4,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),

        // "Enter DTU Bazaar" primary button
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _handleEnterApp,
            style: ElevatedButton.styleFrom(
              backgroundColor: accentAmber,
              foregroundColor: accentDarkInk,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(9),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _isLoading ? 'Entering...' : 'Enter DTU Bazaar',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: accentDarkInk,
                  ),
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

  Widget _buildInlineErrorMessage(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: errorRed.withOpacity(0.12),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: errorRed.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: errorRed, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: errorRed,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
