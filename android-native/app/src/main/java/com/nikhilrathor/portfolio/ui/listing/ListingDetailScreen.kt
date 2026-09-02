package com.nikhilrathor.portfolio.ui.listing

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Chat
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import coil.compose.AsyncImage
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.*
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.net.URLEncoder

class ListingDetailViewModel(
    private val repository: DtuBazaarRepository,
    private val dataStore: DtuBazaarDataStore
) : ViewModel() {

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    fun getListing(id: String): Listing? = repository.getListingById(id)

    fun getRecommendedListings(current: Listing): List<Listing> {
        val all = repository.listings.value.filter { it.id != current.id }
        // 1. Same category
        val sameCategory = all.filter { it.category == current.category }
        // 2. Similar price range (+- 30%)
        val similarPrice = sameCategory.filter {
            val minP = current.price * 0.7
            val maxP = current.price * 1.3
            it.price in minP.toInt()..maxP.toInt()
        }
        val remainder = sameCategory - similarPrice.toSet()
        val others = all - sameCategory.toSet()

        return (similarPrice + remainder + others).take(6)
    }

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
    onNavigateToListing: (String) -> Unit,
    onNavigateToCategory: (String) -> Unit,
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
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            Text("Listing not found", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        return
    }

    val recommendedListings = remember(listing) { viewModel.getRecommendedListings(listing) }

    Scaffold(
        bottomBar = {
            // Sticky Bottom Action Bar with Total Price, WhatsApp & Chat to Buy
            Surface(
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .navigationBarsPadding(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "TOTAL PRICE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontFamily = FontFamily.Monospace,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 9.sp
                            )
                        )
                        Text(
                            text = "₹${listing.price}",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = CampusLimeDark
                            )
                        )
                    }

                    // WhatsApp Icon Button
                    IconButton(
                        onClick = {
                            val msg = "Hi ${listing.seller.name}, I am interested in '${listing.title}' listed for ₹${listing.price} on DTU Bazaar!"
                            val url = "https://wa.me/919315096256?text=${URLEncoder.encode(msg, "UTF-8")}"
                            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        },
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF25D366))
                    ) {
                        Text(text = "💬", fontSize = 18.sp)
                    }

                    // Primary CTA
                    NeonButton(
                        text = "Chat to Buy",
                        onClick = { onOpenChat("conv_1") },
                        variant = NeonButtonVariant.LIME,
                        icon = { Icon(Icons.AutoMirrored.Filled.Chat, contentDescription = null, tint = DarkBackground) },
                        modifier = Modifier.weight(1.4f)
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(innerPadding)
                .verticalScroll(scrollState)
                .padding(bottom = 24.dp)
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
                        .background(MaterialTheme.colorScheme.surface)
                        .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape)
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = MaterialTheme.colorScheme.onSurface)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = {
                            val sendIntent: Intent = Intent().apply {
                                action = Intent.ACTION_SEND
                                putExtra(Intent.EXTRA_TEXT, "Check out ${listing.title} for ₹${listing.price} on DTU Bazaar! https://dtu-bazzar.vercel.app")
                                type = "text/plain"
                            }
                            context.startActivity(Intent.createChooser(sendIntent, "Share Listing"))
                        },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surface)
                            .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", tint = MaterialTheme.colorScheme.onSurface)
                    }

                    IconButton(
                        onClick = { viewModel.toggleSave(listing.id) },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surface)
                            .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape)
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Save",
                            tint = if (isSaved) CampusRed else MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            // Image Hero
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
                    .padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
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
                                listOf(Color.Transparent, Color.Black.copy(alpha = 0.75f))
                            )
                        )
                )

                Row(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ConditionBadge(condition = listing.condition)
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color.Black.copy(alpha = 0.7f))
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "${listing.category.icon} ${listing.category.title}",
                            style = MaterialTheme.typography.labelSmall.copy(color = Color.White, fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            // Title, Price & Pickup Spot
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 16.dp)) {
                Text(
                    text = listing.title,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground
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
                            color = CampusLimeDark
                        )
                    )

                    listing.originalPrice?.let {
                        Text(
                            text = "₹$it",
                            style = MaterialTheme.typography.titleMedium.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textDecoration = TextDecoration.LineThrough
                            )
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(CampusLime.copy(alpha = 0.2f))
                            .padding(horizontal = 7.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "0% COMMISSION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = MaterialTheme.colorScheme.onBackground,
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = CampusCyan, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Pickup Spot: ${listing.pickupLocation}",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                }

                Text(
                    text = "Posted ${listing.createdAt} • ${listing.viewsCount} views",
                    style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            // Seller Info Card with Fixed-Width Rating Block (No text wrap bug!)
            CyberCard(
                backgroundColor = MaterialTheme.colorScheme.surface,
                borderColor = MaterialTheme.colorScheme.outline,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .border(1.5.dp, CampusLime, CircleShape)
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
                                        color = MaterialTheme.colorScheme.onSurface
                                    ),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(Icons.Default.Verified, contentDescription = "Verified", tint = CampusLimeDark, modifier = Modifier.size(14.dp))
                            }
                            Text(
                                text = "${listing.seller.branch.split("(").first().trim()} • ${listing.seller.hostelName}",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 11.sp
                                ),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }

                    // Compact Vertical Stack with Fixed Width (fixes "18 deals" wrap bug)
                    Column(
                        horizontalAlignment = Alignment.End,
                        modifier = Modifier.widthIn(min = 72.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "${listing.seller.rating}",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    color = CampusLimeDark
                                )
                            )
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(text = "★", color = CampusAmber)
                        }
                        Text(
                            text = "${listing.seller.totalDeals} deals",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 10.sp
                            ),
                            maxLines = 1
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Description Section
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    text = "ITEM DESCRIPTION",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    ),
                    modifier = Modifier.padding(bottom = 6.dp)
                )

                Text(
                    text = listing.description,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                        lineHeight = 22.sp
                    )
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Safety Notice Box
            CampusSafetyBanner(modifier = Modifier.padding(horizontal = 16.dp))

            Spacer(modifier = Modifier.height(24.dp))

            // ====================================================
            // RECOMMENDATIONS: "Similar Campus Finds" (LazyRow)
            // ====================================================
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Similar Campus Finds 💡",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    )

                    Text(
                        text = "See All",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = CampusLimeDark,
                            fontWeight = FontWeight.Bold
                        ),
                        modifier = Modifier.clickable { onNavigateToCategory(listing.category.id) }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyRow(
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(recommendedListings) { item ->
                        val isRecSaved = savedIds.contains(item.id)
                        CampusListingCard(
                            listing = item,
                            isSaved = isRecSaved,
                            onCardClick = { onNavigateToListing(item.id) },
                            onSaveClick = { viewModel.toggleSave(item.id) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
