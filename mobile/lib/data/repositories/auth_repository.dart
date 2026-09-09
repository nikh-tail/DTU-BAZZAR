import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/api_endpoints.dart';
import '../../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiClient _client;

  AuthRepository(this._client);

  Future<bool> sendOtp(String email) async {
    try {
      final res = await _client.post(ApiEndpoints.sendOtp, data: {'email': email});
      return res.data['success'] == true;
    } catch (e) {
      print('Send OTP Error: $e');
      return false;
    }
  }

  Future<UserModel?> verifyOtp(String email, String otp) async {
    try {
      final res = await _client.post(ApiEndpoints.verifyOtp, data: {
        'email': email,
        'otp': otp,
      });

      if (res.data['success'] == true) {
        final token = res.data['token'];
        final user = UserModel.fromJson(res.data['data']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        await prefs.setString('user_id', user.id);

        return user;
      }
      return null;
    } catch (e) {
      print('Verify OTP Error: $e');
      return null;
    }
  }

  Future<UserModel?> getProfile() async {
    try {
      final res = await _client.get(ApiEndpoints.getProfile);
      if (res.data['success'] == true) {
        return UserModel.fromJson(res.data['data']);
      }
      return null;
    } catch (e) {
      print('Get Profile Error: $e');
      return null;
    }
  }

  Future<UserModel?> updateProfile(Map<String, dynamic> data) async {
    try {
      final res = await _client.put(ApiEndpoints.updateProfile, data: data);
      if (res.data['success'] == true) {
        return UserModel.fromJson(res.data['data']);
      }
      return null;
    } catch (e) {
      print('Update Profile Error: $e');
      return null;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_id');
  }
}
