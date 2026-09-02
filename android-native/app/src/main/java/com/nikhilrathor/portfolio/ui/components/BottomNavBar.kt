package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.*

enum class CampusNavTab(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    HOME("home", "Home", Icons.Filled.Home, Icons.Outlined.Home),
    EXPLORE("explore", "Explore", Icons.Filled.Search, Icons.Outlined.Search),
    SELL("sell", "Sell", Icons.Filled.Add, Icons.Outlined.Add),
    CHATS("chats", "Chats", Icons.AutoMirrored.Filled.Chat, Icons.AutoMirrored.Outlined.Chat),
    PROFILE("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
}

@Composable
fun CampusBottomNavBar(
    currentRoute: String,
    onTabSelected: (CampusNavTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            CampusNavTab.values().forEach { tab ->
                val isSelected = currentRoute == tab.route

                if (tab == CampusNavTab.SELL) {
                    // Center Elevated Sell FAB
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .offset(y = (-6).dp)
                            .size(50.dp)
                            .shadow(8.dp, CircleShape)
                            .clip(CircleShape)
                            .background(CampusLime)
                            .clickable { onTabSelected(tab) }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Sell on DTU Bazaar",
                            tint = DarkBackground,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                } else {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { onTabSelected(tab) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(
                            imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                            contentDescription = tab.title,
                            tint = if (isSelected) CampusLimeDark else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(22.dp)
                        )

                        Spacer(modifier = Modifier.height(3.dp))

                        Text(
                            text = tab.title,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 10.sp
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}
