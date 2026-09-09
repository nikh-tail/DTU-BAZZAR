import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../state/auth_provider.dart';
import '../../../state/chat_provider.dart';

class ChatWindowScreen extends StatefulWidget {
  final String conversationId;
  final String sellerName;
  final String itemTitle;

  const ChatWindowScreen({
    super.key,
    required this.conversationId,
    required this.sellerName,
    required this.itemTitle,
  });

  @override
  State<ChatWindowScreen> createState() => _ChatWindowScreenState();
}

class _ChatWindowScreenState extends State<ChatWindowScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ChatProvider>(context, listen: false).openConversation(widget.conversationId);
    });
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _handleSend() async {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    _msgController.clear();
    final chatProv = Provider.of<ChatProvider>(context, listen: false);
    final success = await chatProv.sendMessage(text);

    if (success) {
      Future.delayed(const Duration(milliseconds: 100), () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOut,
          );
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final chatProv = Provider.of<ChatProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.sellerName,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            if (widget.itemTitle.isNotEmpty)
              Text(
                widget.itemTitle,
                style: const TextStyle(fontSize: 10, color: AppColors.emeraldPrimary, fontWeight: FontWeight.w700),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: chatProv.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.emeraldPrimary))
                : chatProv.messages.isEmpty
                    ? const Center(
                        child: Text(
                          'Say hello and discuss meetups on DTU campus!',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: chatProv.messages.length,
                        itemBuilder: (context, index) {
                          final msg = chatProv.messages[index];
                          final isMe = msg.senderId == auth.user?.id;
                          final isOffer = msg.content.contains('PRICE OFFER:');

                          return Align(
                            alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              constraints: BoxConstraints(
                                maxWidth: MediaQuery.of(context).size.width * 0.75,
                              ),
                              decoration: BoxDecoration(
                                color: isOffer
                                    ? const Color(0xFFFEF3C7)
                                    : isMe
                                        ? AppColors.primaryLime
                                        : AppColors.surface,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: isOffer
                                      ? const Color(0xFFFCD34D)
                                      : isMe
                                          ? AppColors.primaryLime
                                          : AppColors.border,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    msg.content,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: isOffer ? FontWeight.w800 : FontWeight.w500,
                                      color: isOffer
                                          ? const Color(0xFF92400E)
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Align(
                                    alignment: Alignment.bottomRight,
                                    child: Text(
                                      Formatters.formatTimeAgo(msg.createdAt),
                                      style: TextStyle(
                                        fontSize: 9,
                                        color: isOffer
                                            ? const Color(0xFF92400E).withOpacity(0.7)
                                            : AppColors.textSecondary,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),

          // Message Input Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      onSubmitted: (_) => _handleSend(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.primaryLime,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send, size: 18, color: AppColors.textPrimary),
                      onPressed: _handleSend,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
