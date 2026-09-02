package com.nikhilrathor.portfolio.data.models

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val senderId: String,
    val text: String,
    val timestamp: String,
    val isFromMe: Boolean
)

data class Conversation(
    val id: String,
    val partner: User,
    val listingTitle: String,
    val listingPrice: Int,
    val listingImageUrl: String,
    val lastMessage: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0,
    val messages: List<ChatMessage> = emptyList()
)
