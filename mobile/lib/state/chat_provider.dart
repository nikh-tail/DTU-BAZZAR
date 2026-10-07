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

  DateTime? _parseDateTime(dynamic dt) {
    if (dt == null) return null;
    if (dt is DateTime) return dt;
    return DateTime.tryParse(dt.toString());
  }

  /// Appends message safely with deduplication by ID or
  /// (senderId + content + createdAt within 5 seconds) to prevent duplicate
  /// bubbles from HTTP response + socket broadcast race conditions.
  void addMessageSafely(MessageModel msg) {
    if (msg.content.trim().isEmpty) return;

    final isDuplicate = _messages.any((m) {
      // 1. Strict match by ID
      if (m.id.isNotEmpty && msg.id.isNotEmpty && m.id == msg.id) {
        return true;
      }

      // 2. Match by senderId + content + createdAt within 5 seconds
      if (m.senderId == msg.senderId && m.content.trim() == msg.content.trim()) {
        final mTime = _parseDateTime(m.createdAt);
        final msgTime = _parseDateTime(msg.createdAt);
        if (mTime != null && msgTime != null) {
          final diff = mTime.difference(msgTime).abs();
          if (diff.inSeconds <= 5) return true;
        } else {
          return true;
        }
      }

      return false;
    });

    if (!isDuplicate) {
      _messages.add(msg);
      notifyListeners();
    }
  }

  void handleIncomingSocketMessage(dynamic data) {
    if (data == null || data is! Map) return;

    final convId = data['conversationId']?.toString() ??
        (data['message'] != null && data['message'] is Map
            ? data['message']['conversationId']?.toString()
            : null);

    final dynamic rawMsg = (data['message'] != null && data['message'] is Map)
        ? data['message']
        : data;

    if (rawMsg is Map) {
      final messageData = Map<String, dynamic>.from(rawMsg);
      if (convId == _activeConversationId) {
        final msg = MessageModel.fromJson(messageData);
        addMessageSafely(msg);
      }
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
    _isLoading = true;
    notifyListeners();

    SocketService().joinConversation(conversationId);
    final fetched = await _chatRepo.getMessages(conversationId);
    _messages = fetched;

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
      addMessageSafely(msg);
    }

    _isSending = false;
    notifyListeners();
    return msg != null;
  }

  Future<String?> startChat(String listingId) async {
    return await _chatRepo.startConversation(listingId);
  }
}
