class ApiEndpoints {
  // Live Render Production Backend for DTU Bazaar
  static const String _liveProdBase = 'https://dtu-bazzar.onrender.com';

  static String get baseUrl => '$_liveProdBase/api';
  static String get socketUrl => _liveProdBase;

  // Auth Endpoints
  static const String sendOtp = '/auth/request-otp';
  static const String verifyOtp = '/auth/verify-otp';
  static const String getProfile = '/auth/me';
  static const String updateProfile = '/users/profile';

  // Listings Endpoints
  static const String listings = '/listings';
  static const String myActiveListings = '/users/my-listings';
  static const String mySavedListings = '/users/saved';
  static const String toggleSaveListing = '/users/saved/toggle';

  // Conversations & Chat Endpoints
  static const String conversations = '/chat/conversations';

  // Pro Upgrade & UPI
  static const String createProOrder = '/users/upgrade-tier';
}
