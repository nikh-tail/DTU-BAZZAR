import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_colors.dart';

class ReleaseInfo {
  final String tagName;
  final String title;
  final String body;
  final String downloadUrl;

  ReleaseInfo({
    required this.tagName,
    required this.title,
    required this.body,
    required this.downloadUrl,
  });
}

class UpdateService {
  static const String currentVersion = '2.6.0';
  static const String repoReleasesUrl =
      'https://api.github.com/repos/nikh-tail/DTU-BAZZAR/releases/latest';

  static Future<ReleaseInfo?> checkForUpdate() async {
    try {
      final response = await http.get(
        Uri.parse(repoReleasesUrl),
        headers: {'Accept': 'application/vnd.github.v3+json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final tagName = (data['tag_name'] as String? ?? '').replaceFirst('v', '');
        final releaseTitle = data['name'] as String? ?? 'New DTU Bazaar Update';
        final releaseBody = data['body'] as String? ?? '';

        String? apkDownloadUrl;
        final assets = data['assets'] as List? ?? [];
        for (final asset in assets) {
          final name = asset['name'] as String? ?? '';
          if (name == 'DTU-Bazaar.apk' || name.endsWith('.apk')) {
            apkDownloadUrl = asset['browser_download_url'] as String?;
            break;
          }
        }

        apkDownloadUrl ??=
            'https://github.com/nikh-tail/DTU-BAZZAR/releases/latest/download/DTU-Bazaar.apk';

        if (_isNewerVersion(tagName, currentVersion)) {
          return ReleaseInfo(
            tagName: tagName,
            title: releaseTitle,
            body: releaseBody,
            downloadUrl: apkDownloadUrl,
          );
        }
      }
    } catch (e) {
      print('Check update error: $e');
    }
    return null;
  }

  static bool _isNewerVersion(String remote, String local) {
    try {
      final rParts = remote.split('.').map((p) => int.tryParse(p) ?? 0).toList();
      final lParts = local.split('.').map((p) => int.tryParse(p) ?? 0).toList();

      while (rParts.length < 3) {
        rParts.add(0);
      }
      while (lParts.length < 3) {
        lParts.add(0);
      }

      for (int i = 0; i < 3; i++) {
        if (rParts[i] > lParts[i]) return true;
        if (rParts[i] < lParts[i]) return false;
      }
    } catch (_) {}
    return false;
  }

  static void promptUpdate(BuildContext context, ReleaseInfo info) {
    showModalBottomSheet(
      context: context,
      isDismissible: true,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 20,
                offset: Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: AppColors.limeLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Text('⚡', style: TextStyle(fontSize: 28)),
                ),
                const SizedBox(height: 14),
                Text(
                  'Update Available (v${info.tagName})',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'A newer, faster version of DTU Bazaar is ready with latest bug fixes & improvements.',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryLime,
                      foregroundColor: AppColors.textPrimary,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () async {
                      Navigator.pop(context);
                      final uri = Uri.parse(info.downloadUrl);
                      if (await canLaunchUrl(uri)) {
                        await launchUrl(uri, mode: LaunchMode.externalApplication);
                      }
                    },
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.download_rounded, color: AppColors.textPrimary, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Download & Install Update',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Later',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textMuted,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
