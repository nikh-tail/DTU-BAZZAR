package com.nikhilrathor.portfolio.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.models.User
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import com.nikhilrathor.portfolio.ui.components.VerifiedDtuBadge
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

enum class ProfileTab {
    MY_LISTINGS,
    SAVED_ITEMS,
    REVIEWS
}

class ProfileViewModel(
    private val dataStore: DtuBazaarDataStore,
    private val repository: DtuBazaarRepository
) : ViewModel() {

    private val _selectedTab = MutableStateFlow(ProfileTab.MY_LISTINGS)
    val selectedTab: StateFlow<ProfileTab> = _selectedTab

    val myListings: StateFlow<List<Listing>> = repository.listings

    fun setTab(tab: ProfileTab) {
        _selectedTab.value = tab
    }

    fun logout(onSuccess: () -> Unit) {
        viewModelScope.launch {
            dataStore.logout()
            onSuccess()
        }
    }
}

@Composable
fun ProfileScreen(
    onNavigateToListing: (String) -> Unit,
    onNavigateToAuth: () -> Unit,
    currentUser: User,
    viewModel: ProfileViewModel
) {
    val selectedTab by viewModel.selectedTab.collectAsState()
    val listings by viewModel.myListings.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground)
    ) {
        LazyColumn(
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            // Profile Card
            item {
                CyberCard(
                    backgroundColor = CyberSurface,
                    borderColor = CyberLime.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(60.dp)
                                    .clip(CircleShape)
                                    .background(CyberSurfaceVariant)
                                    .border(2.dp, CyberLime, CircleShape)
                            ) {
                                Text(text = currentUser.avatarEmoji, fontSize = 28.sp)
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = currentUser.name,
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            fontWeight = FontWeight.Black,
                                            color = TextPrimary
                                        )
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Icon(Icons.Default.Verified, contentDescription = null, tint = CyberLime, modifier = Modifier.size(16.dp))
                                }
                                Text(
                                    text = "${currentUser.branch} • ${currentUser.year}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = CyberCyan)
                                )
                                Text(
                                    text = currentUser.hostelName,
                                    style = MaterialTheme.typography.bodySmall.copy(color = TextMuted)
                                )
                            }
                        }
                    }

                    Divider(modifier = Modifier.padding(vertical = 12.dp), color = BorderSubtle)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        StatColumn("4.9 ★", "RATING")
                        StatColumn("18", "DEALS DONE")
                        StatColumn("₹4.2k", "SAVED")
                    }
                }
            }

            // Tab Selector (My Listings, Saved, Reviews)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TabButton("My Listings", selectedTab == ProfileTab.MY_LISTINGS) {
                        viewModel.setTab(ProfileTab.MY_LISTINGS)
                    }
                    TabButton("Saved Items", selectedTab == ProfileTab.SAVED_ITEMS) {
                        viewModel.setTab(ProfileTab.SAVED_ITEMS)
                    }
                    TabButton("Reviews", selectedTab == ProfileTab.REVIEWS) {
                        viewModel.setTab(ProfileTab.REVIEWS)
                    }
                }
            }

            // Tab Content
            when (selectedTab) {
                ProfileTab.MY_LISTINGS -> {
                    items(listings.take(3)) { item ->
                        CyberCard(
                            backgroundColor = CyberSurfaceVariant,
                            borderColor = BorderSubtle,
                            onClick = { onNavigateToListing(item.id) },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = item.title,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = TextPrimary
                                        ),
                                        maxLines = 1
                                    )
                                    Text(
                                        text = "₹${item.price} • ${item.createdAt}",
                                        style = MaterialTheme.typography.bodySmall.copy(color = CyberLime)
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(CyberLime.copy(alpha = 0.2f))
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = "ACTIVE",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = CyberLime,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 9.sp
                                        )
                                    )
                                }
                            }
                        }
                    }
                }

                ProfileTab.SAVED_ITEMS -> {
                    items(listings.takeLast(2)) { item ->
                        CyberCard(
                            backgroundColor = CyberSurfaceVariant,
                            borderColor = BorderSubtle,
                            onClick = { onNavigateToListing(item.id) },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(text = item.title, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = TextPrimary))
                            Text(text = "₹${item.price} • ${item.pickupLocation}", style = MaterialTheme.typography.bodySmall.copy(color = CyberLime))
                        }
                    }
                }

                ProfileTab.REVIEWS -> {
                    item {
                        CyberCard(
                            backgroundColor = CyberSurfaceVariant,
                            borderColor = BorderSubtle,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(text = "⭐ 5.0 from Rohan Verma (CSE)", style = MaterialTheme.typography.labelLarge.copy(color = CyberLime, fontWeight = FontWeight.Bold))
                            Text(text = "\"Quick deal at Mic-Mac, gave the calculator with fresh batteries!\"", style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary), modifier = Modifier.padding(top = 4.dp))
                        }
                    }
                }
            }

            // Trust & Settings Section
            item {
                Spacer(modifier = Modifier.height(10.dp))
                VerifiedDtuBadge(text = "Official ${currentUser.email}")
                Spacer(modifier = Modifier.height(14.dp))

                NeonButton(
                    text = "Sign Out",
                    onClick = { viewModel.logout(onNavigateToAuth) },
                    variant = NeonButtonVariant.GHOST,
                    icon = { Icon(Icons.Default.Logout, contentDescription = null, tint = ErrorColor) },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
private fun StatColumn(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge.copy(
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Black,
                color = CyberLime
            )
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                fontSize = 9.sp,
                color = TextMuted
            )
        )
    }
}

@Composable
private fun RowScope.TabButton(text: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyberLime else CyberSurface)
            .clickable { onClick() }
            .padding(vertical = 10.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                color = if (isSelected) CyberBackground else TextSecondary
            )
        )
    }
}
