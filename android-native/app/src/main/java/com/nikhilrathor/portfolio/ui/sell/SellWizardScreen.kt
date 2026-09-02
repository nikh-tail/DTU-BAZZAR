package com.nikhilrathor.portfolio.ui.sell

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import com.nikhilrathor.portfolio.data.models.*
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

data class SellFormState(
    val step: Int = 1,
    val title: String = "",
    val description: String = "",
    val price: String = "",
    val originalPrice: String = "",
    val category: ListingCategory = ListingCategory.DRAWING_TOOLS,
    val condition: ItemCondition = ItemCondition.LIKE_NEW,
    val pickupLocation: String = "Mic-Mac Canteen",
    val titleError: String? = null,
    val priceError: String? = null
)

class SellViewModel(private val repository: DtuBazaarRepository) : ViewModel() {
    private val _state = MutableStateFlow(SellFormState())
    val state: StateFlow<SellFormState> = _state

    val campusLocations = repository.campusLocations

    fun updateTitle(t: String) { _state.value = _state.value.copy(title = t, titleError = null) }
    fun updateDesc(d: String) { _state.value = _state.value.copy(description = d) }
    fun updatePrice(p: String) { _state.value = _state.value.copy(price = p, priceError = null) }
    fun updateOriginalPrice(op: String) { _state.value = _state.value.copy(originalPrice = op) }
    fun updateCategory(cat: ListingCategory) { _state.value = _state.value.copy(category = cat) }
    fun updateCondition(cond: ItemCondition) { _state.value = _state.value.copy(condition = cond) }
    fun updateLocation(loc: String) { _state.value = _state.value.copy(pickupLocation = loc) }

    fun nextStep() {
        val s = _state.value
        if (s.step == 1 && s.title.trim().isEmpty()) {
            _state.value = s.copy(titleError = "Title is required")
            return
        }
        if (s.step == 3 && (s.price.trim().isEmpty() || s.price.toIntOrNull() == null)) {
            _state.value = s.copy(priceError = "Valid price in ₹ is required")
            return
        }
        if (s.step < 4) {
            _state.value = s.copy(step = s.step + 1)
        }
    }

    fun previousStep() {
        if (_state.value.step > 1) {
            _state.value = _state.value.copy(step = _state.value.step - 1)
        }
    }

    fun publishListing(currentUser: User, onPublished: (String) -> Unit) {
        val s = _state.value
        val newListing = Listing(
            id = "listing_${System.currentTimeMillis()}",
            title = s.title.trim(),
            description = s.description.ifEmpty { "Listed by DTU student on campus marketplace." },
            price = s.price.toIntOrNull() ?: 500,
            originalPrice = s.originalPrice.toIntOrNull(),
            category = s.category,
            condition = s.condition,
            imageUrls = listOf("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"),
            pickupLocation = s.pickupLocation,
            seller = currentUser,
            createdAt = "Just now"
        )
        repository.addListing(newListing)
        _state.value = SellFormState() // reset
        onPublished(newListing.id)
    }
}

@Composable
fun SellWizardScreen(
    onNavigateBack: () -> Unit,
    onListingCreated: (String) -> Unit,
    currentUser: User,
    viewModel: SellViewModel
) {
    val state by viewModel.state.collectAsState()
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .statusBarsPadding(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        if (state.step > 1) viewModel.previousStep() else onNavigateBack()
                    },
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(CyberSurfaceVariant)
                ) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                }

                Text(
                    text = "Sell Campus Gear",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                )

                Text(
                    text = "Step ${state.step}/4",
                    style = MaterialTheme.typography.labelMedium.copy(color = CyberLime)
                )
            }
        },
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
                        .navigationBarsPadding()
                ) {
                    if (state.step < 4) {
                        NeonButton(
                            text = "Continue",
                            onClick = { viewModel.nextStep() },
                            variant = NeonButtonVariant.LIME,
                            icon = { Icon(Icons.Default.ArrowForward, contentDescription = null, tint = CyberBackground) },
                            modifier = Modifier.fillMaxWidth()
                        )
                    } else {
                        NeonButton(
                            text = "🚀 Post in 60 Seconds",
                            onClick = { viewModel.publishListing(currentUser, onListingCreated) },
                            variant = NeonButtonVariant.LIME,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
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
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            when (state.step) {
                1 -> SellStep1Info(state, viewModel)
                2 -> SellStep2CategoryCondition(state, viewModel)
                3 -> SellStep3PriceLocation(state, viewModel)
                4 -> SellStep4Review(state, currentUser)
            }
        }
    }
}

@Composable
private fun SellStep1Info(state: SellFormState, viewModel: SellViewModel) {
    Column {
        Text(
            text = "Item Details",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Give your gear a clear, concise title so fellow students can find it.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        OutlinedTextField(
            value = state.title,
            onValueChange = { viewModel.updateTitle(it) },
            label = { Text("Item Title") },
            placeholder = { Text("e.g. Casio fx-991CW Calculator / ED Drafter") },
            isError = state.titleError != null,
            supportingText = state.titleError?.let { { Text(it, color = ErrorColor) } },
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyberLime,
                unfocusedBorderColor = BorderSubtle,
                focusedContainerColor = CyberSurface,
                unfocusedContainerColor = CyberSurface
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = state.description,
            onValueChange = { viewModel.updateDesc(it) },
            label = { Text("Description & Notes") },
            placeholder = { Text("Mention condition, included accessories, or semester use...") },
            minLines = 4,
            maxLines = 6,
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyberLime,
                unfocusedBorderColor = BorderSubtle,
                focusedContainerColor = CyberSurface,
                unfocusedContainerColor = CyberSurface
            ),
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
private fun SellStep2CategoryCondition(state: SellFormState, viewModel: SellViewModel) {
    Column {
        Text(
            text = "Category & Condition",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Categorize your item to connect with relevant students.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
        )

        Text(
            text = "CATEGORY",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        ListingCategory.values().forEach { cat ->
            val isSelected = state.category == cat
            CyberCard(
                backgroundColor = if (isSelected) CyberLime.copy(alpha = 0.15f) else CyberSurface,
                borderColor = if (isSelected) CyberLime else BorderSubtle,
                borderWidth = if (isSelected) 2.dp else 1.dp,
                onClick = { viewModel.updateCategory(cat) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = cat.icon, fontSize = 20.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = cat.title,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) CyberLime else TextPrimary
                            )
                        )
                    }
                    if (isSelected) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = CyberLime)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "CONDITION",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ItemCondition.values().forEach { cond ->
                val isSelected = state.condition == cond
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) Color(cond.badgeColorHex).copy(alpha = 0.2f) else CyberSurface)
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) Color(cond.badgeColorHex) else BorderSubtle,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable { viewModel.updateCondition(cond) }
                        .padding(vertical = 12.dp)
                ) {
                    Text(
                        text = cond.label,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color(cond.badgeColorHex) else TextSecondary
                        )
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SellStep3PriceLocation(state: SellFormState, viewModel: SellViewModel) {
    var locExpanded by remember { mutableStateOf(false) }

    Column {
        Text(
            text = "Price & Campus Handoff",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Set a student-friendly price and pick where you want to meet.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = state.price,
                onValueChange = { viewModel.updatePrice(it) },
                label = { Text("Selling Price (₹)") },
                placeholder = { Text("750") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                isError = state.priceError != null,
                supportingText = state.priceError?.let { { Text(it, color = ErrorColor) } },
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberLime,
                    unfocusedBorderColor = BorderSubtle,
                    focusedContainerColor = CyberSurface,
                    unfocusedContainerColor = CyberSurface
                ),
                modifier = Modifier.weight(1f)
            )

            OutlinedTextField(
                value = state.originalPrice,
                onValueChange = { viewModel.updateOriginalPrice(it) },
                label = { Text("MRP / Original (₹)") },
                placeholder = { Text("1400") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberLime,
                    unfocusedBorderColor = BorderSubtle,
                    focusedContainerColor = CyberSurface,
                    unfocusedContainerColor = CyberSurface
                ),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "CAMPUS PICKUP SPOT",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        ExposedDropdownMenuBox(
            expanded = locExpanded,
            onExpandedChange = { locExpanded = !locExpanded }
        ) {
            OutlinedTextField(
                value = state.pickupLocation,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = locExpanded) },
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberLime,
                    unfocusedBorderColor = BorderSubtle,
                    focusedContainerColor = CyberSurface,
                    unfocusedContainerColor = CyberSurface
                ),
                modifier = Modifier
                    .menuAnchor()
                    .fillMaxWidth()
            )

            ExposedDropdownMenu(
                expanded = locExpanded,
                onDismissRequest = { locExpanded = false }
            ) {
                viewModel.campusLocations.forEach { loc ->
                    DropdownMenuItem(
                        text = { Text(loc, color = TextPrimary) },
                        onClick = {
                            viewModel.updateLocation(loc)
                            locExpanded = false
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun SellStep4Review(state: SellFormState, currentUser: User) {
    Column {
        Text(
            text = "Review & Post",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Your listing will go live instantly on DTU Bazaar.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        CyberCard(
            backgroundColor = CyberSurface,
            borderColor = CyberLime.copy(alpha = 0.5f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "ITEM", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = state.title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = TextPrimary))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "PRICE", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = "₹${state.price}", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, color = CyberLime))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "CATEGORY", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = "${state.category.icon} ${state.category.title}", style = MaterialTheme.typography.bodyMedium.copy(color = CyberCyan))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "LOCATION", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = state.pickupLocation, style = MaterialTheme.typography.bodyMedium.copy(color = TextPrimary))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "SELLER", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = "${currentUser.name} (Verified)", style = MaterialTheme.typography.bodyMedium.copy(color = CyberLime))
            }
        }
    }
}
