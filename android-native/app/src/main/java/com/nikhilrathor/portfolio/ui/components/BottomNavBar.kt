package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.*

enum class CampusNavTab(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector
) {
    HOME("home", "Home", Icons.Outlined.Home, Icons.Filled.Home),
    EXPLORE("explore", "Explore", Icons.Outlined.Explore, Icons.Filled.Explore),
    SELL("sell", "Sell", Icons.Filled.Add, Icons.Filled.Add),
    CHATS("chats", "Chats", Icons.Outlined.Chat, Icons.Filled.Chat),
    PROFILE("profile", "Profile", Icons.Outlined.Person, Icons.Filled.Person)
}

@Composable
fun CampusBottomNavBar(
    currentRoute: String,
    onTabSelected: (CampusNavTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = CyberSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp)
                .navigationBarsPadding(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            CampusNavTab.values().forEach { tab ->
                val isSelected = currentRoute == tab.route

                if (tab == CampusNavTab.SELL) {
                    // Center Elevated FAB
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .offset(y = (-10).dp)
                            .clickable { onTabSelected(tab) }
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(50.dp)
                                .shadow(8.dp, CircleShape, spotColor = CyberLime)
                                .clip(CircleShape)
                                .background(CyberLime)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Sell Gear",
                                tint = CyberBackground,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Sell",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 10.sp,
                                color = CyberLime
                            )
                        )
                    }
                } else {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(CircleShape)
                            .clickable { onTabSelected(tab) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(
                            imageVector = if (isSelected) tab.selectedIcon else tab.icon,
                            contentDescription = tab.label,
                            tint = if (isSelected) CyberLime else TextMuted,
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.height(3.dp))
                        Text(
                            text = tab.label,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 10.sp,
                                color = if (isSelected) TextPrimary else TextMuted
                            )
                        )
                    }
                }
            }
        }
    }
}
