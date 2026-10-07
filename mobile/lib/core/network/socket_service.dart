import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_endpoints.dart';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  bool get isConnected => _socket?.connected ?? false;

  void connect({
    Function(dynamic)? onNewMessage,
    Function(dynamic)? onNotification,
    Function(dynamic)? onUserTyping,
    Function(dynamic)? onUserStoppedTyping,
  }) async {
    if (_socket != null && _socket!.connected) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    _socket = IO.io(
      ApiEndpoints.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      print('⚡ Connected to DTU Bazaar Live Socket Server');
    });

    _socket!.on('new_message', (data) {
      if (onNewMessage != null) {
        onNewMessage(data);
      }
    });

    _socket!.on('new_message_notification', (data) {
      if (onNotification != null) {
        onNotification(data);
      }
    });

    _socket!.on('user_typing', (data) {
      if (onUserTyping != null) {
        onUserTyping(data);
      }
    });

    _socket!.on('user_stopped_typing', (data) {
      if (onUserStoppedTyping != null) {
        onUserStoppedTyping(data);
      }
    });

    _socket!.onDisconnect((_) {
      print('❌ Disconnected from DTU Bazaar Socket Server');
    });
  }

  void joinConversation(String conversationId) {
    if (conversationId.isNotEmpty) {
      _socket?.emit('join_conversation', conversationId);
    }
  }

  void leaveConversation(String conversationId) {
    if (conversationId.isNotEmpty) {
      _socket?.emit('leave_conversation', conversationId);
    }
  }

  void startTyping(String conversationId) {
    if (conversationId.isNotEmpty) {
      _socket?.emit('typing_start', {'conversationId': conversationId});
    }
  }

  void stopTyping(String conversationId) {
    if (conversationId.isNotEmpty) {
      _socket?.emit('typing_stop', {'conversationId': conversationId});
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
