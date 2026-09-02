package com.nikhilrathor.portfolio.ui.explore

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.ItemCondition
import com.nikhilrathor.portfolio.data.models.Listing
import com.nikhilrathor.portfolio.data.models.ListingCategory
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CampusListingCard
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

    private val _selectedCategory = MutableStateFlow(ListingCategory.DRAWING_TOOLS)
    val selectedCategory: StateFlow<ListingCategory> = _selectedCategory

    private val _isTwoPaneMode = MutableStateFlow(true)
    val isTwoPaneMode: StateFlow<Boolean> = _isTwoPaneMode

    val savedIds: StateFlow<Set<String>> = dataStore.savedListingsFlow
        .stateIn(viewModelScope, SharingStarted.Lazily, emptySet())

    val popularSearches = listOf(
        "Casio fx-991CW",
        "Mini Drafter & Kit",
        "Hostel Desert Cooler",
        "CLRS Algorithms Book",
        "Keychron Keyboard",
        "Badminton Racket"
    )

    val categoryListings: StateFlow<List<Listing>> = combine(
        repository.listings,
        _selectedCategory,
        _searchQuery
    ) { all, cat, query ->
        all.filter { item ->
            val matchesCategory = item.category == cat
            val matchesQuery = query.isEmpty() ||
                    item.title.contains(query, ignoreCase = true) ||
                    item.description.contains(query, ignoreCase = true)
            matchesCategory && matchesQuery
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, repository.listings.value)

    val allSearchListings: StateFlow<List<Listing>> = combine(
        repository.listings,
        _searchQuery
    ) { all, query ->
        if (query.isEmpty()) emptyList()
        else all.filter {
            it.title.contains(query, ignoreCase = true) ||
                    it.description.contains(query, ignoreCase = true) ||
                    it.tags.any { tag -> tag.contains(query, ignoreCase = true) }
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }

    fun onSelectCategory(cat: ListingCategory) {
        _selectedCategory.value = cat
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
    val categoryListings by viewModel.categoryListings.collectAsState()
    val allSearchListings by viewModel.allSearchListings.collectAsState()
    val savedIds by viewModel.savedIds.collectAsState()

    val isSearching = searchQuery.trim().isNotEmpty()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Search Header
        Surface(
            color = MaterialTheme.colorScheme.surface,
            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { viewModel.onSearchQueryChange(it) },
                    placeholder = { Text("Search campus marketplace...", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = CampusLimeDark) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.onSearchQueryChange("") }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CampusLime,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                        focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        if (isSearching) {
            // ==========================================
            // SEARCH RESULTS VIEW
            // ==========================================
            if (allSearchListings.isEmpty()) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.fillMaxSize().padding(32.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "🔍", fontSize = 40.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No listings found for '$searchQuery'",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground)
                        )
                        Text(
                            text = "Try searching for drafter, cooler, casio, or clrs",
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(allSearchListings) { item ->
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
            }
        } else {
            // ==========================================
            // TWO-PANE CATEGORY VIEW (SharePal Style)
            // ==========================================
            Row(modifier = Modifier.fillMaxSize()) {
                // Left Vertical Category Rail (Fixed 90dp)
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    modifier = Modifier
                        .width(92.dp)
                        .fillMaxHeight()
                ) {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(ListingCategory.values()) { cat ->
                            val isSelected = selectedCategory == cat
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { viewModel.onSelectCategory(cat) }
                                    .background(
                                        if (isSelected) CampusLime.copy(alpha = 0.15f) else Color.Transparent
                                    )
                                    .padding(vertical = 12.dp, horizontal = 6.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    // Left Active Pill Bar
                                    Box(
                                        modifier = Modifier
                                            .width(3.dp)
                                            .height(36.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(if (isSelected) CampusLimeDark else Color.Transparent)
                                    )

                                    Spacer(modifier = Modifier.width(6.dp))

                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text(text = cat.icon, fontSize = 22.sp)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = cat.title,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
                                                color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontSize = 10.sp
                                            ),
                                            maxLines = 2,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Right Pane: Category Items & Grid
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .padding(horizontal = 12.dp, vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${selectedCategory.icon} ${selectedCategory.title}",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                        )
                        Text(
                            text = "${categoryListings.size} items",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    if (categoryListings.isEmpty()) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.fillMaxSize().padding(16.dp)
                        ) {
                            Text(
                                text = "No items in this category yet. Be the first to post!",
                                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                            )
                        }
                    } else {
                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.fillMaxSize()
                        ) {
                            items(categoryListings) { item ->
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
                    }
                }
            }
        }
    }
}
