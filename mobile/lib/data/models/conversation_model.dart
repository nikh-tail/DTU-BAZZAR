import 'user_model.dart';
import 'listing_model.dart';

class MessageModel {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final bool isRead;
  final dynamic createdAt;
  final UserModel? sender;

  MessageModel({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    this.isRead = false,
    this.createdAt,
    this.sender,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'] ?? '',
      conversationId: json['conversationId'] ?? '',
      senderId: json['senderId'] ?? '',
      content: json['content'] ?? '',
      isRead: json['isRead'] ?? false,
      createdAt: json['createdAt'],
      sender: json['sender'] != null ? UserModel.fromJson(json['sender']) : null,
    );
  }
}

class ConversationModel {
  final String id;
  final String listingId;
  final String buyerId;
  final String sellerId;
  final UserModel? otherUser;
  final ListingModel? listing;
  final MessageModel? lastMessage;
  final int unreadCount;
  final dynamic updatedAt;

  ConversationModel({
    required this.id,
    required this.listingId,
    required this.buyerId,
    required this.sellerId,
    this.otherUser,
    this.listing,
    this.lastMessage,
    this.unreadCount = 0,
    this.updatedAt,
  });

  factory ConversationModel.fromJson(Map<String, dynamic> json, String currentUserId) {
    final buyer = json['buyer'] != null ? UserModel.fromJson(json['buyer']) : null;
    final seller = json['seller'] != null ? UserModel.fromJson(json['seller']) : null;
    final other = (buyer != null && buyer.id != currentUserId) ? buyer : seller;

    MessageModel? last;
    if (json['messages'] != null && (json['messages'] as List).isNotEmpty) {
      last = MessageModel.fromJson((json['messages'] as List).first);
    } else if (json['lastMessage'] != null) {
      last = MessageModel.fromJson(json['lastMessage']);
    }

    return ConversationModel(
      id: json['id'] ?? '',
      listingId: json['listingId'] ?? '',
      buyerId: json['buyerId'] ?? '',
      sellerId: json['sellerId'] ?? '',
      otherUser: other,
      listing: json['listing'] != null ? ListingModel.fromJson(json['listing']) : null,
      lastMessage: last,
      unreadCount: json['unreadCount'] ?? 0,
      updatedAt: json['updatedAt'],
    );
  }
}
