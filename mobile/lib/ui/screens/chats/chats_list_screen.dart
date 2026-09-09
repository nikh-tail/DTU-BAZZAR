import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../state/auth_provider.dart';
import '../../../state/chat_provider.dart';
import '../../widgets/empty_state.dart';
import '../auth/auth_screen.dart';
import 'chat_window_screen.dart';

class ChatsListScreen extends StatefulWidget {
  const ChatsListScreen({super.key});

  @override
  State<ChatsListScreen> createState() => _ChatsListScreenState();
}

class _ChatsListScreenState extends State<ChatsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (auth.isAuthenticated) {
        Provider.of<ChatProvider>(context, listen: false).fetchConversations();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final chatProv = Provider.of<ChatProvider>(context);

    if (!auth.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('Campus Messages')),
        body: EmptyState(
          title: 'Login to see messages',
          description: 'Connect directly with batchmates and seniors across hostels.',
          actionText: 'Log In Now',
          onAction: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const AuthScreen()));
          },
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Campus Messages'),
      ),
      body: chatProv.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.emeraldPrimary))
          : chatProv.conversations.isEmpty
              ? const EmptyState(
                  title: 'No conversations yet',
                  description: 'When you message a seller or someone chats about your listing, it will appear here.',
                )
              : RefreshIndicator(
                  onRefresh: () => chatProv.fetchConversations(),
                  color: AppColors.emeraldPrimary,
                  child: ListView.separated(
                    itemCount: chatProv.conversations.length,
                    separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.border),
                    itemBuilder: (context, index) {
                      final conv = chatProv.conversations[index];
                      final otherName = conv.otherUser?.name ?? 'DTU Student';
                      final lastMsg = conv.lastMessage?.content ?? 'Started a new conversation';

                      return ListTile(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ChatWindowScreen(
                                conversationId: conv.id,
                                sellerName: otherName,
                                itemTitle: conv.listing?.title ?? '',
                              ),
                            ),
                          );
                        },
                        leading: CircleAvatar(
                          backgroundColor: AppColors.limeLight,
                          child: Text(
                            otherName.substring(0, 1).toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                          ),
                        ),
                        title: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              otherName,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                            ),
                            Text(
                              Formatters.formatTimeAgo(conv.updatedAt),
                              style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                            ),
                          ],
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (conv.listing != null)
                              Text(
                                '🏷️ ${conv.listing!.title}',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.emeraldPrimary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            Text(
                              lastMsg,
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
