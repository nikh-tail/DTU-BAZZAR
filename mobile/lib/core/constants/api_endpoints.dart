import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Configured for local Android Emulator (10.0.2.2), iOS Simulator (localhost), and Cloud Production
  static String get baseUrl {
    if (kReleaseMode) {
      return 'https://dtu-bazaar.vercel.app/api';
    }
    if (kIsWeb) {
      return 'http://localhost:5001/api';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5001/api';
    }
    return 'http://localhost:5001/api';
  }

  static String get socketUrl {
    if (kReleaseMode) {
      return 'https://dtu-bazaar.vercel.app';
    }
    if (kIsWeb) {
      return 'http://localhost:5001';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5001';
    }
    return 'http://localhost:5001';
  }

  // Auth
  static const String sendOtp = '/auth/send-otp';
  static const String verifyOtp = '/auth/verify-otp';
  static const String getProfile = '/auth/me';
  static const String updateProfile = '/auth/profile';

  // Listings
  static const String listings = '/listings';
  static const String myActiveListings = '/listings/my/active';
  static const String mySoldListings = '/listings/my/sold';
  static const String mySavedListings = '/listings/my/saved';
  static const String toggleSaveListing = '/listings/save';

  // Conversations & Chat
  static const String conversations = '/conversations';
  static const String messages = '/messages';

  // Pro Upgrade & UPI
  static const String createProOrder = '/payments/pro-upgrade';
}
