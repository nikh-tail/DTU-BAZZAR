package com.nikhilrathor.portfolio.ui.listing

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import coil.compose.AsyncImage
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CampusSafetyBanner
import com.nikhilrathor.portfolio.ui.components.ConditionBadge
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import com.nikhilrathor.portfolio.ui.components.VerifiedDtuBadge
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ListingDetailViewModel(
    private val repository: DtuBazaarRepository,
    private val dataStore: DtuBazaarDataStore
) : ViewModel() {

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    fun getListing(id: String): Listing? = repository.getListingById(id)

    fun toggleSave(id: String) {
        viewModelScope.launch {
            dataStore.toggleSavedListing(id)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ListingDetailScreen(
    listingId: String,
    onNavigateBack: () -> Unit,
    onOpenChat: (String) -> Unit,
    viewModel: ListingDetailViewModel
) {
    val listing = remember(listingId) { viewModel.getListing(listingId) }
    val savedIds by viewModel.savedIds.collectAsState()
    val isSaved = savedIds.contains(listingId)
    val scrollState = rememberScrollState()
    val context = LocalContext.current

    if (listing == null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberBackground),
            contentAlignment = Alignment.Center
        ) {
            Text("Listing not found", color = TextSecondary)
        }
        return
    }

    Scaffold(
        bottomBar = {
            Surface(
                color = CyberSurface,
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 12.dp)
                        .navigationBarsPadding(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "TOTAL PRICE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontFamily = FontFamily.Monospace,
                                color = TextMuted,
                                fontSize = 9.sp
                            )
                        )
                        Text(
                            text = "₹${listing.price}",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = CyberLime
                            )
                        )
                    }

                    NeonButton(
                        text = "Chat to Buy",
                        onClick = { onOpenChat("conv_1") },
                        variant = NeonButtonVariant.LIME,
                        icon = { Icon(Icons.Default.Chat, contentDescription = null, tint = CyberBackground) },
                        modifier = Modifier.weight(1.5f)
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberBackground)
                .padding(innerPadding)
                .verticalScroll(scrollState)
        ) {
            // Top Nav Controls
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .statusBarsPadding(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onNavigateBack,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(CyberSurfaceVariant)
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = {
                            val sendIntent: Intent = Intent().apply {
                                action = Intent.ACTION_SEND
                                putExtra(Intent.EXTRA_TEXT, "Check out ${listing.title} for ₹${listing.price} on DTU Bazaar!")
                                type = "text/plain"
                            }
                            context.startActivity(Intent.createChooser(sendIntent, "Share Listing"))
                        },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(CyberSurfaceVariant)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", tint = TextPrimary)
                    }

                    IconButton(
                        onClick = { viewModel.toggleSave(listing.id) },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(CyberSurfaceVariant)
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Save",
                            tint = if (isSaved) Color(0xFFEF4444) else TextPrimary
                        )
                    }
                }
            }

            // Image Banner
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .padding(horizontal = 20.dp)
                    .clip(RoundedCornerShape(20.dp))
            ) {
                AsyncImage(
                    model = listing.imageUrls.firstOrNull(),
                    contentDescription = listing.title,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                            )
                        )
                )

                Row(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ConditionBadge(condition = listing.condition)
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(CyberSurfaceVariant)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "${listing.category.icon} ${listing.category.title}",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextPrimary, fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            // Title, Price & Location
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text(
                    text = listing.title,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "₹${listing.price}",
                        style = MaterialTheme.typography.displaySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = CyberLime
                        )
                    )

                    listing.originalPrice?.let {
                        Text(
                            text = "₹$it",
                            style = MaterialTheme.typography.titleMedium.copy(
                                color = TextMuted,
                                textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough
                            )
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(CyberLime.copy(alpha = 0.15f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "0% FEE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CyberLime,
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Handoff: ${listing.pickupLocation}", style = MaterialTheme.typography.bodyMedium.copy(color = CyberCyan))
                }

                Text(
                    text = "Posted ${listing.createdAt} • ${listing.viewsCount} views",
                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            // Seller Info Card (Verified DTUite)
            CyberCard(
                backgroundColor = CyberSurface,
                borderColor = CyberLime.copy(alpha = 0.35f),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
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
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(CyberSurfaceVariant)
                                .border(1.5.dp, CyberLime, CircleShape)
                        ) {
                            Text(text = listing.seller.avatarEmoji, fontSize = 22.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = listing.seller.name,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(Icons.Default.Verified, contentDescription = "Verified", tint = CyberLime, modifier = Modifier.size(14.dp))
                            }
                            Text(
                                text = "${listing.seller.branch.split("(").first().trim()} • ${listing.seller.hostelName}",
                                style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
                            )
                        }
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "${listing.seller.rating} ★",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = CyberLime
                            )
                        )
                        Text(
                            text = "${listing.seller.totalDeals} deals",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Description
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(
                    text = "DESCRIPTION",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = FontFamily.Monospace,
                        color = TextMuted,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    ),
                    modifier = Modifier.padding(bottom = 6.dp)
                )

                Text(
                    text = listing.description,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = TextSecondary,
                        lineHeight = 22.sp
                    )
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Safety Banner
            CampusSafetyBanner(modifier = Modifier.padding(horizontal = 20.dp))

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
