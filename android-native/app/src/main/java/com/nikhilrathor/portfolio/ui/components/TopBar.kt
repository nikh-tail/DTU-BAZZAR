package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PortfolioTopBar(
    title: String,
    modifier: Modifier = Modifier,
    canNavigateBack: Boolean = false,
    onNavigateBack: () -> Unit = {},
    statusBadge: String? = "AVAILABLE",
    onAvatarClick: (() -> Unit)? = null,
    avatarEmoji: String = "⚡"
) {
    TopAppBar(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                )

                statusBadge?.let {
                    Spacer(modifier = Modifier.width(8.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(StatusOnline.copy(alpha = 0.15f))
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(StatusOnline)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = it,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = StatusOnline,
                                fontSize = 9.sp
                            )
                        )
                    }
                }
            }
        },
        navigationIcon = {
            if (canNavigateBack) {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary
                    )
                }
            }
        },
        actions = {
            onAvatarClick?.let {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .padding(end = 12.dp)
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(CyberSurfaceVariant)
                        .clickable { it() }
                ) {
                    Text(text = avatarEmoji, fontSize = 16.sp)
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = CyberBackground,
            titleContentColor = TextPrimary,
            navigationIconContentColor = TextPrimary
        ),
        modifier = modifier
    )
}
