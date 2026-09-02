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
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.models.User
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CampusListingCard
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import com.nikhilrathor.portfolio.ui.components.VerifiedDtuBadge
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
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

    val themeMode: StateFlow<AppThemeMode> = dataStore.themeModeFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, AppThemeMode.DARK)

    val myListings: StateFlow<List<Listing>> = repository.listings

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    fun setTab(tab: ProfileTab) {
        _selectedTab.value = tab
    }

    fun setThemeMode(mode: AppThemeMode) {
        viewModelScope.launch {
            dataStore.setThemeMode(mode)
        }
    }

    fun toggleSave(listingId: String) {
        viewModelScope.launch {
            dataStore.toggleSavedListing(listingId)
        }
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
    val savedIds by viewModel.savedIds.collectAsState()
    val currentTheme by viewModel.themeMode.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        LazyColumn(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            // Profile Card
            item {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(60.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                                    .border(2.dp, CampusLime, CircleShape)
                            ) {
                                Text(text = currentUser.avatarEmoji, fontSize = 28.sp)
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = currentUser.name,
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            fontWeight = FontWeight.Black,
                                            color = MaterialTheme.colorScheme.onSurface
                                        ),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Icon(Icons.Default.Verified, contentDescription = null, tint = CampusLimeDark, modifier = Modifier.size(16.dp))
                                }
                                Text(
                                    text = "${currentUser.branch} • ${currentUser.year}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = CampusCyanDark),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = currentUser.hostelName,
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 12.dp),
                            color = MaterialTheme.colorScheme.outline
                        )

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
            }

            // Theme Selector Card (System / Light / Dark)
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Palette, contentDescription = null, tint = CampusLimeDark, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Appearance & Theme",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            ThemeChoiceButton("System", currentTheme == AppThemeMode.SYSTEM) {
                                viewModel.setThemeMode(AppThemeMode.SYSTEM)
                            }
                            ThemeChoiceButton("☀️ Light", currentTheme == AppThemeMode.LIGHT) {
                                viewModel.setThemeMode(AppThemeMode.LIGHT)
                            }
                            ThemeChoiceButton("🌙 Dark", currentTheme == AppThemeMode.DARK) {
                                viewModel.setThemeMode(AppThemeMode.DARK)
                            }
                        }
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
                    TabButton("Saved (${savedIds.size})", selectedTab == ProfileTab.SAVED_ITEMS) {
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
                        val isSaved = savedIds.contains(item.id)
                        CampusListingCard(
                            listing = item,
                            isSaved = isSaved,
                            onCardClick = { onNavigateToListing(item.id) },
                            onSaveClick = { viewModel.toggleSave(item.id) },
                            cardWidth = null
                        )
                    }
                }

                ProfileTab.SAVED_ITEMS -> {
                    val savedListings = listings.filter { savedIds.contains(it.id) }
                    if (savedListings.isEmpty()) {
                        item {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 32.dp)
                            ) {
                                Text(
                                    text = "No saved listings yet. Tap the heart icon on any card!",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                            }
                        }
                    } else {
                        items(savedListings) { item ->
                            CampusListingCard(
                                listing = item,
                                isSaved = true,
                                onCardClick = { onNavigateToListing(item.id) },
                                onSaveClick = { viewModel.toggleSave(item.id) },
                                cardWidth = null
                            )
                        }
                    }
                }

                ProfileTab.REVIEWS -> {
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = MaterialTheme.colorScheme.surface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "⭐ 5.0 from Rohan Verma (CSE)",
                                    style = MaterialTheme.typography.labelLarge.copy(
                                        color = CampusLimeDark,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                                Text(
                                    text = "\"Quick handoff at Mic-Mac Canteen, calculator had fresh batteries!\"",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    ),
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Trust & Sign Out Section
            item {
                Spacer(modifier = Modifier.height(8.dp))
                VerifiedDtuBadge(text = "Official Campus Member: ${currentUser.email}")
                Spacer(modifier = Modifier.height(12.dp))

                NeonButton(
                    text = "Sign Out",
                    onClick = { viewModel.logout(onNavigateToAuth) },
                    variant = NeonButtonVariant.GHOST,
                    icon = { Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = CampusRed) },
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
                color = CampusLimeDark
            )
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
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
            .background(if (isSelected) CampusLime else MaterialTheme.colorScheme.surface)
            .border(1.dp, if (isSelected) CampusLime else MaterialTheme.colorScheme.outline, RoundedCornerShape(10.dp))
            .clickable { onClick() }
            .padding(vertical = 10.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                color = if (isSelected) DarkBackground else MaterialTheme.colorScheme.onSurface
            ),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
private fun RowScope.ThemeChoiceButton(text: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CampusLime.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant)
            .border(1.dp, if (isSelected) CampusLime else Color.Transparent, RoundedCornerShape(10.dp))
            .clickable { onClick() }
            .padding(vertical = 8.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 11.sp
            ),
            maxLines = 1
        )
    }
}
