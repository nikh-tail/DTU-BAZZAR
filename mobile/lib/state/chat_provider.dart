import 'package:flutter/material.dart';
import '../data/models/conversation_model.dart';
import '../data/repositories/chat_repository.dart';
import '../core/network/socket_service.dart';

class ChatProvider extends ChangeNotifier {
  final ChatRepository _chatRepo;

  List<ConversationModel> _conversations = [];
  List<MessageModel> _messages = [];
  String? _activeConversationId;
  bool _isLoading = false;
  bool _isSending = false;

  List<ConversationModel> get conversations => _conversations;
  List<MessageModel> get messages => _messages;
  String? get activeConversationId => _activeConversationId;
  bool get isLoading => _isLoading;
  bool get isSending => _isSending;

  ChatProvider(this._chatRepo) {
    SocketService().connect(onNewMessage: (data) {
      handleIncomingSocketMessage(data);
    });
  }

  void handleIncomingSocketMessage(dynamic data) {
    if (data != null && data['conversationId'] == _activeConversationId) {
      final msg = MessageModel.fromJson(data);
      _messages.add(msg);
      notifyListeners();
    }
    fetchConversations();
  }

  Future<void> fetchConversations() async {
    _isLoading = true;
    notifyListeners();

    _conversations = await _chatRepo.getConversations();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> openConversation(String conversationId) async {
    _activeConversationId = conversationId;
    _messages = [];
    _isLoading = true;
    notifyListeners();

    SocketService().joinConversation(conversationId);
    _messages = await _chatRepo.getMessages(conversationId);

    _isLoading = false;
    notifyListeners();
  }

  void closeConversation() {
    if (_activeConversationId != null) {
      SocketService().leaveConversation(_activeConversationId!);
      _activeConversationId = null;
      _messages = [];
    }
  }

  Future<bool> sendMessage(String content) async {
    if (_activeConversationId == null || content.trim().isEmpty) return false;

    _isSending = true;
    notifyListeners();

    final msg = await _chatRepo.sendMessage(_activeConversationId!, content.trim());
    if (msg != null) {
      _messages.add(msg);
    }

    _isSending = false;
    notifyListeners();
    return msg != null;
  }

  Future<String?> startChat(String listingId) async {
    return await _chatRepo.startConversation(listingId);
  }
}
