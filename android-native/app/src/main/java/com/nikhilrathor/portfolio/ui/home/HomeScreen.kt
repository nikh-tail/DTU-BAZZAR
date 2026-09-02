package com.nikhilrathor.portfolio.ui.home

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
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import coil.compose.AsyncImage
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.*
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: DtuBazaarRepository,
    private val dataStore: DtuBazaarDataStore
) : ViewModel() {

    val listings: StateFlow<List<Listing>> = repository.listings
    val stats: List<CampusStat> = repository.getStats()
    val testimonials: List<Testimonial> = repository.getTestimonials()

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    fun toggleSave(listingId: String) {
        viewModelScope.launch {
            dataStore.toggleSavedListing(listingId)
        }
    }
}

@Composable
fun HomeScreen(
    onNavigateToListing: (String) -> Unit,
    onNavigateToCategory: (String) -> Unit,
    onNavigateToExplore: () -> Unit,
    onNavigateToSell: () -> Unit,
    currentUser: User,
    viewModel: HomeViewModel
) {
    val listings by viewModel.listings.collectAsState()
    val savedIds by viewModel.savedIds.collectAsState()
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground)
            .verticalScroll(scrollState)
            .padding(bottom = 24.dp)
    ) {
        // 1. Top Greeting & Campus Tag
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(CyberSurfaceVariant.copy(alpha = 0.8f), CyberBackground)
                    )
                )
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(42.dp)
                                .clip(CircleShape)
                                .background(CyberSurfaceVariant)
                                .border(1.5.dp, CyberLime, CircleShape)
                        ) {
                            Text(text = currentUser.avatarEmoji, fontSize = 20.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                text = "Hey, ${currentUser.name.split(" ").first()} 👋",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    color = TextPrimary
                                )
                            )
                            Text(
                                text = "${currentUser.branch.split("(").first().trim()} • ${currentUser.hostelName}",
                                style = MaterialTheme.typography.bodySmall.copy(color = CyberCyan)
                            )
                        }
                    }

                    VerifiedDtuBadge()
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Search Bar Card
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CyberSurface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToExplore() }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = CyberLime,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Search drafters, casio 991, coolers, notes...",
                            style = MaterialTheme.typography.bodyMedium.copy(color = TextMuted)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 2. Horizontal Category Chips (7 exact categories)
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "CAMPUS CATEGORIES",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = TextMuted,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 8.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(ListingCategory.values()) { cat ->
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = CyberSurface,
                        border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                        modifier = Modifier.clickable { onNavigateToCategory(cat.id) }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = cat.icon, fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = cat.title,
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 3. Trending Campus Finds Carousel
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Trending Campus Finds 🔥",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = TextPrimary
                        )
                    )
                    Text(
                        text = "Most active gear listed by DTU hostelers & day scholars",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
                    )
                }

                Text(
                    text = "See All",
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = CyberLime,
                        fontWeight = FontWeight.Bold
                    ),
                    modifier = Modifier.clickable { onNavigateToExplore() }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(listings) { item ->
                    val isSaved = savedIds.contains(item.id)

                    CyberCard(
                        backgroundColor = CyberSurface,
                        borderColor = BorderSubtle,
                        onClick = { onNavigateToListing(item.id) },
                        modifier = Modifier.width(260.dp)
                    ) {
                        // Image Box
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(140.dp)
                                .clip(RoundedCornerShape(12.dp))
                        ) {
                            AsyncImage(
                                model = item.imageUrls.firstOrNull(),
                                contentDescription = item.title,
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

                            // Condition Badge on top left
                            Box(modifier = Modifier.padding(8.dp).align(Alignment.TopStart)) {
                                ConditionBadge(condition = item.condition)
                            }

                            // Save Button on top right
                            IconButton(
                                onClick = { viewModel.toggleSave(item.id) },
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .padding(4.dp)
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(CyberBackground.copy(alpha = 0.7f))
                            ) {
                                Icon(
                                    imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                    contentDescription = "Save",
                                    tint = if (isSaved) Color(0xFFEF4444) else Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Price & Title
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "₹${item.price}",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Black,
                                    color = CyberLime
                                )
                            )

                            item.originalPrice?.let {
                                Text(
                                    text = "₹$it",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = TextMuted,
                                        textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough
                                    )
                                )
                            }
                        }

                        Text(
                            text = item.title,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            ),
                            maxLines = 1,
                            modifier = Modifier.padding(top = 2.dp)
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        // Pickup Location
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = TextMuted,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = item.pickupLocation,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = TextMuted,
                                    fontSize = 10.sp
                                ),
                                maxLines = 1
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 4. Campus Safety Banner
        CampusSafetyBanner(modifier = Modifier.padding(horizontal = 20.dp))

        Spacer(modifier = Modifier.height(20.dp))

        // 5. Stats Strip (Horizontally scrollable)
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "CAMPUS IMPACT",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = TextMuted,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 8.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(viewModel.stats) { stat ->
                    CyberCard(
                        backgroundColor = CyberSurface,
                        borderColor = BorderSubtle,
                        modifier = Modifier.width(160.dp)
                    ) {
                        Text(text = stat.icon, fontSize = 20.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = stat.value,
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = CyberLime
                            )
                        )
                        Text(
                            text = stat.title,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        )
                        Text(
                            text = stat.subtext,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                color = TextMuted
                            )
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 6. Testimonials Carousel
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Student Experiences ⭐",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Black,
                    color = TextPrimary
                ),
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 10.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(viewModel.testimonials) { t ->
                    CyberCard(
                        backgroundColor = CyberSurfaceVariant,
                        borderColor = CyberCyan.copy(alpha = 0.35f),
                        modifier = Modifier.width(280.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = t.avatarEmoji, fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = t.studentName,
                                    style = MaterialTheme.typography.labelLarge.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                )
                                Text(
                                    text = "${t.branch} • ${t.hostel}",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 9.sp,
                                        color = CyberCyan
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "\"${t.quote}\"",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = TextSecondary,
                                lineHeight = 16.sp
                            )
                        )
                    }
                }
            }
        }
    }
}
