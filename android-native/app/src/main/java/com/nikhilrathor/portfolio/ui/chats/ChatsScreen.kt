package com.nikhilrathor.portfolio.ui.chats

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import coil.compose.AsyncImage
import com.nikhilrathor.portfolio.data.models.Conversation
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CyberCard
import kotlinx.coroutines.flow.StateFlow

class ChatsViewModel(private val repository: DtuBazaarRepository) : ViewModel() {
    val conversations: StateFlow<List<Conversation>> = repository.conversations

    fun getConversation(id: String): Conversation? {
        return repository.conversations.value.find { it.id == id }
    }

    fun sendMessage(convId: String, text: String) {
        if (text.trim().isEmpty()) return
        repository.sendMessage(convId, text.trim())
    }
}

@Composable
fun ChatsListScreen(
    onNavigateToChat: (String) -> Unit,
    viewModel: ChatsViewModel
) {
    val conversations by viewModel.conversations.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            Text(
                text = "Campus Messages 💬",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Black,
                    color = TextPrimary
                )
            )
            Text(
                text = "Direct chats with verified DTU buyers & sellers",
                style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
            )
        }

        if (conversations.isEmpty()) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp)
            ) {
                Text(text = "No active conversations yet.", color = TextMuted)
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(conversations) { conv ->
                    CyberCard(
                        backgroundColor = CyberSurface,
                        borderColor = BorderSubtle,
                        onClick = { onNavigateToChat(conv.id) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(CyberSurfaceVariant)
                                    .border(1.5.dp, CyberLime, CircleShape)
                            ) {
                                Text(text = conv.partner.avatarEmoji, fontSize = 22.sp)
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = conv.partner.name,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = TextPrimary
                                        )
                                    )
                                    Text(
                                        text = conv.lastMessageTime,
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = TextMuted,
                                            fontSize = 10.sp
                                        )
                                    )
                                }

                                Text(
                                    text = "Re: ${conv.listingTitle} (₹${conv.listingPrice})",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = CyberCyan,
                                        fontWeight = FontWeight.SemiBold
                                    ),
                                    maxLines = 1
                                )

                                Text(
                                    text = conv.lastMessage,
                                    style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary),
                                    maxLines = 1,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ChatConversationScreen(
    conversationId: String,
    onNavigateBack: () -> Unit,
    viewModel: ChatsViewModel
) {
    val conversation = viewModel.getConversation(conversationId)
    var inputMessage by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    val quickReplies = listOf(
        "Is this still available?",
        "Can we meet at Mic-Mac Canteen?",
        "Can we meet at OAT?",
        "Will pay via UPI upon inspection 👍"
    )

    if (conversation == null) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxSize()
                .background(CyberBackground)
        ) {
            Text("Conversation not found", color = TextSecondary)
        }
        return
    }

    LaunchedEffect(conversation.messages.size) {
        if (conversation.messages.isNotEmpty()) {
            listState.animateScrollToItem(conversation.messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            Surface(
                color = CyberSurface,
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .statusBarsPadding(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                    }

                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(CyberSurfaceVariant)
                    ) {
                        Text(text = conversation.partner.avatarEmoji, fontSize = 18.sp)
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = conversation.partner.name,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        )
                        Text(
                            text = "${conversation.partner.branch} • Verified",
                            style = MaterialTheme.typography.labelSmall.copy(color = CyberLime, fontSize = 10.sp)
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberBackground)
                .padding(innerPadding)
        ) {
            // Item Header Strip
            Surface(
                color = CyberSurfaceVariant,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(6.dp))
                    ) {
                        AsyncImage(
                            model = conversation.listingImageUrl,
                            contentDescription = null,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = conversation.listingTitle,
                            style = MaterialTheme.typography.labelLarge.copy(color = TextPrimary, fontWeight = FontWeight.Bold),
                            maxLines = 1
                        )
                        Text(
                            text = "₹${conversation.listingPrice} • Campus Deal",
                            style = MaterialTheme.typography.labelSmall.copy(color = CyberLime, fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            // Messages List
            LazyColumn(
                state = listState,
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(conversation.messages) { msg ->
                    val isMe = msg.isFromMe

                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = if (isMe) Alignment.CenterEnd else Alignment.CenterStart
                    ) {
                        Surface(
                            shape = RoundedCornerShape(
                                topStart = 16.dp,
                                topEnd = 16.dp,
                                bottomStart = if (isMe) 16.dp else 4.dp,
                                bottomEnd = if (isMe) 4.dp else 16.dp
                            ),
                            color = if (isMe) CyberLime else CyberSurface,
                            border = if (!isMe) androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle) else null,
                            modifier = Modifier.widthIn(max = 280.dp)
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)) {
                                Text(
                                    text = msg.text,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = if (isMe) CyberBackground else TextPrimary,
                                        fontWeight = if (isMe) FontWeight.SemiBold else FontWeight.Normal
                                    )
                                )
                                Text(
                                    text = msg.timestamp,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = if (isMe) CyberBackground.copy(alpha = 0.6f) else TextMuted,
                                        fontSize = 8.sp
                                    ),
                                    modifier = Modifier.align(Alignment.End).padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Quick Reply Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(quickReplies) { reply ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(CyberSurface)
                            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                            .clickable { viewModel.sendMessage(conversationId, reply) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(text = reply, style = MaterialTheme.typography.bodySmall.copy(color = CyberCyan, fontSize = 11.sp))
                    }
                }
            }

            // Message Input
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .navigationBarsPadding(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = inputMessage,
                    onValueChange = { inputMessage = it },
                    placeholder = { Text("Type campus message...", color = TextMuted) },
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = {
                        viewModel.sendMessage(conversationId, inputMessage)
                        inputMessage = ""
                    }),
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberLime,
                        unfocusedBorderColor = BorderSubtle,
                        focusedContainerColor = CyberSurface,
                        unfocusedContainerColor = CyberSurface
                    ),
                    modifier = Modifier.weight(1f)
                )

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(
                    onClick = {
                        viewModel.sendMessage(conversationId, inputMessage)
                        inputMessage = ""
                    },
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(CyberLime)
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", tint = CyberBackground)
                }
            }
        }
    }
}
