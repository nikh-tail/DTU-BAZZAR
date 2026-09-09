import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';
import '../core/network/socket_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthRepository _authRepo;

  UserModel? _user;
  bool _isLoading = true;
  bool _isSendingOtp = false;
  bool _isVerifyingOtp = false;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  bool get isSendingOtp => _isSendingOtp;
  bool get isVerifyingOtp => _isVerifyingOtp;

  AuthProvider(this._authRepo) {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token != null && token.isNotEmpty) {
      _user = await _authRepo.getProfile();
      if (_user != null) {
        SocketService().connect();
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> sendOtp(String email) async {
    _isSendingOtp = true;
    notifyListeners();

    final success = await _authRepo.sendOtp(email);

    _isSendingOtp = false;
    notifyListeners();
    return success;
  }

  Future<bool> verifyOtp(String email, String otp) async {
    _isVerifyingOtp = true;
    notifyListeners();

    final user = await _authRepo.verifyOtp(email, otp);
    _user = user;

    if (user != null) {
      SocketService().connect();
    }

    _isVerifyingOtp = false;
    notifyListeners();
    return user != null;
  }

  Future<bool> updateProfile(Map<String, dynamic> data) async {
    _isLoading = true;
    notifyListeners();

    final updated = await _authRepo.updateProfile(data);
    if (updated != null) {
      _user = updated;
    }

    _isLoading = false;
    notifyListeners();
    return updated != null;
  }

  Future<void> logout() async {
    await _authRepo.logout();
    _user = null;
    SocketService().disconnect();
    notifyListeners();
  }
}
