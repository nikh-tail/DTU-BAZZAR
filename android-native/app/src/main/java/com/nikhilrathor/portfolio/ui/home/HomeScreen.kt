package com.nikhilrathor.portfolio.ui.home

import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
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
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class PromoBanner(
    val id: String,
    val tag: String,
    val title: String,
    val subtitle: String,
    val accentColor: Color
)

class HomeViewModel(
    private val repository: DtuBazaarRepository,
    private val dataStore: DtuBazaarDataStore
) : ViewModel() {

    val listings: StateFlow<List<Listing>> = repository.listings
    val stats: List<CampusStat> = repository.getStats()
    val testimonials: List<Testimonial> = repository.getTestimonials()

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    val themeMode: StateFlow<AppThemeMode> = dataStore.themeModeFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, AppThemeMode.DARK)

    val promoBanners = listOf(
        PromoBanner(
            "b1",
            "SEMESTER KICKOFF",
            "DTU Student Marketplace",
            "Buy & sell drawing tools, coolers, and tech with 0% commission.",
            CampusLime
        ),
        PromoBanner(
            "b2",
            "CAMPUS VERIFIED",
            "0km Room-to-Room Delivery",
            "Connect directly with hostelers across Aryabhatta, Sir JC Bose & VVS.",
            CampusCyan
        ),
        PromoBanner(
            "b3",
            "SAFETY FIRST",
            "Meet At Mic-Mac or OAT",
            "Inspect items in person before paying securely via UPI.",
            CampusPurple
        )
    )

    fun toggleSave(listingId: String) {
        viewModelScope.launch {
            dataStore.toggleSavedListing(listingId)
        }
    }

    fun toggleTheme() {
        viewModelScope.launch {
            val next = if (themeMode.value == AppThemeMode.DARK) AppThemeMode.LIGHT else AppThemeMode.DARK
            dataStore.setThemeMode(next)
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
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
    val currentTheme by viewModel.themeMode.collectAsState()
    val scrollState = rememberScrollState()
    val pagerState = rememberPagerState(pageCount = { viewModel.promoBanners.size })

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
            .padding(bottom = 32.dp)
    ) {
        // ====================================================
        // 1. TOP BAR: User Info + Verified Pill + Theme Toggle
        // ====================================================
        Surface(
            color = MaterialTheme.colorScheme.surface,
            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 12.dp)
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
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .border(1.5.dp, CampusLime, CircleShape)
                        ) {
                            Text(text = currentUser.avatarEmoji, fontSize = 20.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                text = "Hey, ${currentUser.name.split(" ").first()} 👋",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    color = MaterialTheme.colorScheme.onSurface
                                ),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = "${currentUser.branch.split("(").first().trim()} • ${currentUser.hostelName}",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 11.sp
                                ),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Quick Theme Toggle Button
                        IconButton(
                            onClick = { viewModel.toggleTheme() },
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Icon(
                                imageVector = if (currentTheme == AppThemeMode.DARK) Icons.Outlined.LightMode else Icons.Outlined.DarkMode,
                                contentDescription = "Toggle Theme",
                                tint = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        VerifiedDtuBadge()
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ====================================================
        // 2. SEARCH BAR: Full-Width, Rounded, SharePal Style
        // ====================================================
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .clickable { onNavigateToExplore() }
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = CampusLimeDark,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Search scientific calculators, coolers, drafters...",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ====================================================
        // 3. PROMOTIONAL BANNER CAROUSEL (with Dot Indicators)
        // ====================================================
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            HorizontalPager(
                state = pagerState,
                contentPadding = PaddingValues(horizontal = 16.dp),
                pageSpacing = 12.dp,
                modifier = Modifier.fillMaxWidth()
            ) { page ->
                val banner = viewModel.promoBanners[page]
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, banner.accentColor.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.horizontalGradient(
                                    listOf(
                                        banner.accentColor.copy(alpha = 0.15f),
                                        MaterialTheme.colorScheme.surface
                                    )
                                )
                            )
                            .padding(20.dp)
                    ) {
                        Column {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(banner.accentColor.copy(alpha = 0.2f))
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = banner.tag,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Black,
                                        color = banner.accentColor,
                                        fontSize = 9.sp
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = banner.title,
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )

                            Text(
                                text = banner.subtitle,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    lineHeight = 16.sp
                                ),
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Pagination Dots
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                repeat(viewModel.promoBanners.size) { index ->
                    val isSelected = pagerState.currentPage == index
                    Box(
                        modifier = Modifier
                            .height(5.dp)
                            .width(if (isSelected) 18.dp else 6.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(
                                if (isSelected) CampusLime else MaterialTheme.colorScheme.outline
                            )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ====================================================
        // 4. "TOP CATEGORIES" Circular Icon Row (SharePal Style)
        // ====================================================
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "TOP CATEGORIES",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 10.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(ListingCategory.values()) { cat ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .width(68.dp)
                            .clickable { onNavigateToCategory(cat.id) }
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape)
                        ) {
                            Text(text = cat.icon, fontSize = 24.sp)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = cat.title.split(" ").first(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface,
                                fontSize = 11.sp
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ====================================================
        // 5. FULL CATEGORY GRID (2-Column Larger Cards)
        // ====================================================
        Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Explore by Department",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
                Text(
                    text = "All (7)",
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = CampusLimeDark,
                        fontWeight = FontWeight.Bold
                    ),
                    modifier = Modifier.clickable { onNavigateToExplore() }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 2-Column Grid (Chunked pairs, capped at 6 with View All)
            val displayCategories = ListingCategory.values().take(6)
            val categoryPairs = displayCategories.chunked(2)
            categoryPairs.forEach { pair ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    pair.forEach { cat ->
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = MaterialTheme.colorScheme.surface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.6f)),
                            shadowElevation = 2.dp,
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onNavigateToCategory(cat.id) }
                        ) {
                            Column(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(14.dp)
                                ) {
                                    Text(
                                        text = cat.title,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Black,
                                            color = MaterialTheme.colorScheme.onSurface
                                        ),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = cat.subtitle,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontSize = 10.5.sp,
                                            lineHeight = 14.sp
                                        ),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                }

                                // Product Image Representation
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(100.dp)
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    coil.compose.AsyncImage(
                                        model = cat.imageUrl,
                                        contentDescription = cat.title,
                                        contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                // Solid Colored Bottom Accent Strip (8dp height, rounded bottom corners)
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(8.dp)
                                        .background(androidx.compose.ui.graphics.Color(cat.stripColorHex))
                                )
                            }
                        }
                    }
                    if (pair.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ====================================================
        // 6. "TRENDING CAMPUS FINDS" (Horizontal LazyRow)
        // ====================================================
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Trending Campus Finds 🔥",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    )
                    Text(
                        text = "Most active gear listed by DTU students",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }

                Text(
                    text = "See All",
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = CampusLimeDark,
                        fontWeight = FontWeight.Bold
                    ),
                    modifier = Modifier.clickable { onNavigateToExplore() }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(listings) { item ->
                    val isSaved = savedIds.contains(item.id)
                    CampusListingCard(
                        listing = item,
                        isSaved = isSaved,
                        onCardClick = { onNavigateToListing(item.id) },
                        onSaveClick = { viewModel.toggleSave(item.id) }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ====================================================
        // 7. CAMPUS SAFETY BANNER
        // ====================================================
        CampusSafetyBanner(modifier = Modifier.padding(horizontal = 16.dp))

        Spacer(modifier = Modifier.height(24.dp))

        // ====================================================
        // 8. CAMPUS STATS STRIP (Horizontally Scrollable)
        // ====================================================
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "CAMPUS IMPACT",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                ),
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 8.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(viewModel.stats) { stat ->
                    CyberCard(
                        backgroundColor = MaterialTheme.colorScheme.surface,
                        borderColor = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.width(150.dp)
                    ) {
                        Text(text = stat.icon, fontSize = 20.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = stat.value,
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = CampusLimeDark
                            )
                        )
                        Text(
                            text = stat.title,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = stat.subtext,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ====================================================
        // 9. TESTIMONIALS CAROUSEL
        // ====================================================
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Student Experiences ⭐",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onSurface
                ),
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 10.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(viewModel.testimonials) { t ->
                    CyberCard(
                        backgroundColor = MaterialTheme.colorScheme.surface,
                        borderColor = CampusCyan.copy(alpha = 0.35f),
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
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                )
                                Text(
                                    text = "${t.branch} • ${t.hostel}",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 9.sp,
                                        color = CampusCyanDark
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "\"${t.quote}\"",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                lineHeight = 16.sp
                            )
                        )
                    }
                }
            }
        }
    }
}
