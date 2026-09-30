import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/api_endpoints.dart';
import '../../core/network/api_client.dart';
import '../models/conversation_model.dart';

class ChatRepository {
  final ApiClient _client;

  ChatRepository(this._client);

  Future<List<ConversationModel>> getConversations() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final currentUserId = prefs.getString('user_id') ?? '';

      final res = await _client.get(ApiEndpoints.conversations);
      if (res.data['success'] == true) {
        final list = res.data['data'] as List;
        return list.map((json) => ConversationModel.fromJson(json, currentUserId)).toList();
      }
      return [];
    } catch (e) {
      print('Get Conversations Error: $e');
      return [];
    }
  }

  Future<List<MessageModel>> getMessages(String conversationId) async {
    try {
      final res = await _client.get('${ApiEndpoints.conversations}/$conversationId/messages');
      if (res.data != null && res.data['success'] == true) {
        final dynamic data = res.data['data'];
        List list = [];
        if (data is Map && data['messages'] is List) {
          list = data['messages'] as List;
        } else if (data is List) {
          list = data;
        }
        return list.map((json) => MessageModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get Messages Error: $e');
      return [];
    }
  }

  Future<MessageModel?> sendMessage(String conversationId, String content) async {
    try {
      final res = await _client.post(
        '${ApiEndpoints.conversations}/$conversationId/messages',
        data: {
          'text': content,
          'content': content,
        },
      );
      if (res.data != null && res.data['success'] == true && res.data['data'] != null) {
        return MessageModel.fromJson(res.data['data']);
      }
      return null;
    } catch (e) {
      print('Send Message Error: $e');
      return null;
    }
  }

  Future<String?> startConversation(String listingId) async {
    try {
      final res = await _client.post(
        ApiEndpoints.conversations,
        data: {'listingId': listingId},
      );
      if (res.data != null && res.data['success'] == true && res.data['data'] != null) {
        return res.data['data']['id']?.toString();
      }
      return null;
    } catch (e) {
      print('Start Conversation Error: $e');
      return null;
    }
  }
}
