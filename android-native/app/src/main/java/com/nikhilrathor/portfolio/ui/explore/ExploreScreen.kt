package com.nikhilrathor.portfolio.ui.explore

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import coil.compose.AsyncImage
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.ItemCondition
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.models.ListingCategory
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.ConditionBadge
import com.nikhilrathor.portfolio.ui.components.CyberCard
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ExploreViewModel(
    private val repository: DtuBazaarRepository,
    private val dataStore: DtuBazaarDataStore
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _selectedCategory = MutableStateFlow<ListingCategory?>(null)
    val selectedCategory: StateFlow<ListingCategory?> = _selectedCategory

    private val _selectedCondition = MutableStateFlow<ItemCondition?>(null)
    val selectedCondition: StateFlow<ItemCondition?> = _selectedCondition

    private val _isGridView = MutableStateFlow(true)
    val isGridView: StateFlow<Boolean> = _isGridView

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    val filteredListings: StateFlow<List<Listing>> = combine(
        repository.listings,
        _searchQuery,
        _selectedCategory,
        _selectedCondition
    ) { all, query, cat, cond ->
        all.filter { item ->
            val matchesCategory = cat == null || item.category == cat
            val matchesCondition = cond == null || item.condition == cond
            val matchesQuery = query.isEmpty() ||
                    item.title.contains(query, ignoreCase = true) ||
                    item.description.contains(query, ignoreCase = true) ||
                    item.tags.any { it.contains(query, ignoreCase = true) }
            matchesCategory && matchesCondition && matchesQuery
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, repository.listings.value)

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }

    fun onSelectCategory(cat: ListingCategory?) {
        _selectedCategory.value = cat
    }

    fun onSelectCondition(cond: ItemCondition?) {
        _selectedCondition.value = cond
    }

    fun toggleViewMode() {
        _isGridView.value = !_isGridView.value
    }

    fun toggleSave(listingId: String) {
        viewModelScope.launch {
            dataStore.toggleSavedListing(listingId)
        }
    }
}

@Composable
fun ExploreScreen(
    onNavigateToListing: (String) -> Unit,
    viewModel: ExploreViewModel
) {
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedCondition by viewModel.selectedCondition.collectAsState()
    val isGridView by viewModel.isGridView.collectAsState()
    val filteredListings by viewModel.filteredListings.collectAsState()
    val savedIds by viewModel.savedIds.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground)
    ) {
        // Search & Filter Header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { viewModel.onSearchQueryChange(it) },
                    placeholder = { Text("Search campus marketplace...", color = TextMuted) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = CyberLime) },
                    singleLine = true,
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyberLime,
                        unfocusedBorderColor = BorderSubtle,
                        focusedContainerColor = CyberSurface,
                        unfocusedContainerColor = CyberSurface
                    ),
                    modifier = Modifier.weight(1f)
                )

                IconButton(
                    onClick = { viewModel.toggleViewMode() },
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(CyberSurface)
                ) {
                    Icon(
                        imageVector = if (isGridView) Icons.Default.ViewList else Icons.Default.GridView,
                        contentDescription = "Toggle View",
                        tint = CyberLime
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Categories Filter Bar
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick = { viewModel.onSelectCategory(null) },
                        label = { Text("All Categories") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = CyberLime,
                            selectedLabelColor = CyberBackground,
                            containerColor = CyberSurface,
                            labelColor = TextSecondary
                        )
                    )
                }

                items(ListingCategory.values()) { cat ->
                    val isSelected = selectedCategory == cat
                    FilterChip(
                        selected = isSelected,
                        onClick = { viewModel.onSelectCategory(if (isSelected) null else cat) },
                        label = { Text("${cat.icon} ${cat.title}") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = CyberLime,
                            selectedLabelColor = CyberBackground,
                            containerColor = CyberSurface,
                            labelColor = TextSecondary
                        )
                    )
                }
            }
        }

        // Listings Grid / List View
        if (filteredListings.isEmpty()) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "🔍", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No Items Found",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    )
                    Text(
                        text = "Try clearing search keywords or post a request on DTU Bazaar.",
                        style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        } else if (isGridView) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredListings) { item ->
                    val isSaved = savedIds.contains(item.id)

                    CyberCard(
                        backgroundColor = CyberSurface,
                        borderColor = BorderSubtle,
                        onClick = { onNavigateToListing(item.id) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp)
                                .clip(RoundedCornerShape(10.dp))
                        ) {
                            AsyncImage(
                                model = item.imageUrls.firstOrNull(),
                                contentDescription = item.title,
                                modifier = Modifier.fillMaxSize()
                            )
                            ConditionBadge(
                                condition = item.condition,
                                modifier = Modifier.padding(6.dp).align(Alignment.TopStart)
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "₹${item.price}",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = CyberLime
                            )
                        )

                        Text(
                            text = item.title,
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            ),
                            maxLines = 2,
                            modifier = Modifier.padding(top = 2.dp)
                        )

                        Text(
                            text = item.pickupLocation,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted,
                                fontSize = 9.sp
                            ),
                            maxLines = 1,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredListings) { item ->
                    CyberCard(
                        backgroundColor = CyberSurface,
                        borderColor = BorderSubtle,
                        onClick = { onNavigateToListing(item.id) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(80.dp)
                                    .clip(RoundedCornerShape(10.dp))
                            ) {
                                AsyncImage(
                                    model = item.imageUrls.firstOrNull(),
                                    contentDescription = item.title,
                                    modifier = Modifier.fillMaxSize()
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                ConditionBadge(condition = item.condition)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = item.title,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    ),
                                    maxLines = 1
                                )
                                Text(
                                    text = "₹${item.price} • ${item.pickupLocation}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = CyberLime),
                                    maxLines = 1
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
