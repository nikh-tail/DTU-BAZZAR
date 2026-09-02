package com.nikhilrathor.portfolio.ui.sell

import androidx.compose.animation.*
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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import com.nikhilrathor.portfolio.data.models.*
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.ConditionBadge
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
            Surface(
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .statusBarsPadding(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = MaterialTheme.colorScheme.onSurface)
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    Column {
                        Text(
                            text = "List Campus Gear 🏷️",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        )
                        Text(
                            text = "Step ${state.step} of 4 • Posts in 60s",
                            style = MaterialTheme.typography.labelSmall.copy(color = CampusLimeDark, fontSize = 10.sp)
                        )
                    }
                }
            }
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .navigationBarsPadding(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    if (state.step > 1) {
                        NeonButton(
                            text = "Back",
                            onClick = { viewModel.previousStep() },
                            variant = NeonButtonVariant.OUTLINE,
                            icon = { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface) },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    NeonButton(
                        text = if (state.step == 4) "Publish Listing 🚀" else "Next Step",
                        onClick = {
                            if (state.step == 4) {
                                viewModel.publishListing(currentUser, onListingCreated)
                            } else {
                                viewModel.nextStep()
                            }
                        },
                        variant = NeonButtonVariant.LIME,
                        icon = {
                            if (state.step < 4) {
                                Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = DarkBackground)
                            }
                        },
                        modifier = Modifier.weight(1.5f)
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
                .padding(horizontal = 16.dp, vertical = 16.dp)
        ) {
            // Step Indicator
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                (1..4).forEach { i ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(4.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(if (i <= state.step) CampusLime else MaterialTheme.colorScheme.outline)
                    )
                }
            }

            AnimatedContent(targetState = state.step, label = "sell_step") { step ->
                when (step) {
                    1 -> Step1Details(state, viewModel)
                    2 -> Step2CategoryAndCondition(state, viewModel)
                    3 -> Step3PriceAndLocation(state, viewModel)
                    4 -> Step4Review(state)
                }
            }
        }
    }
}

@Composable
private fun Step1Details(state: SellFormState, viewModel: SellViewModel) {
    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = MaterialTheme.colorScheme.outline,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "ITEM TITLE",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        OutlinedTextField(
            value = state.title,
            onValueChange = { viewModel.updateTitle(it) },
            placeholder = { Text("e.g. Casio fx-991CW with warranty card", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)) },
            isError = state.titleError != null,
            supportingText = state.titleError?.let { { Text(it, color = CampusRed) } },
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CampusLime,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "DESCRIPTION & SPECS",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        OutlinedTextField(
            value = state.description,
            onValueChange = { viewModel.updateDesc(it) },
            placeholder = { Text("Mention condition, usage duration, and if accessories are included...", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)) },
            minLines = 4,
            shape = RoundedCornerShape(12.dp),
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

@Composable
private fun Step2CategoryAndCondition(state: SellFormState, viewModel: SellViewModel) {
    Column(modifier = Modifier.fillMaxWidth()) {
        CyberCard(
            backgroundColor = MaterialTheme.colorScheme.surface,
            borderColor = MaterialTheme.colorScheme.outline,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "SELECT CATEGORY",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold
                ),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            ListingCategory.values().forEach { cat ->
                val isSelected = state.category == cat
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (isSelected) CampusLime.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant,
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) CampusLime else Color.Transparent),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 6.dp)
                        .clickable { viewModel.updateCategory(cat) }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = cat.icon, fontSize = 20.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = cat.title,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        CyberCard(
            backgroundColor = MaterialTheme.colorScheme.surface,
            borderColor = MaterialTheme.colorScheme.outline,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "ITEM CONDITION",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold
                ),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ItemCondition.values().forEach { cond ->
                    val isSelected = state.condition == cond
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (isSelected) CampusLime.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant,
                        border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) CampusLime else MaterialTheme.colorScheme.outline),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { viewModel.updateCondition(cond) }
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.padding(vertical = 8.dp)
                        ) {
                            Text(
                                text = cond.label,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontSize = 10.sp
                                ),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Step3PriceAndLocation(state: SellFormState, viewModel: SellViewModel) {
    var locExpanded by remember { mutableStateOf(false) }

    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = MaterialTheme.colorScheme.outline,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "SELLING PRICE (₹)",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        OutlinedTextField(
            value = state.price,
            onValueChange = { viewModel.updatePrice(it) },
            placeholder = { Text("e.g. 790", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)) },
            leadingIcon = { Text("₹", fontWeight = FontWeight.Black, color = CampusLimeDark, fontSize = 18.sp, modifier = Modifier.padding(start = 12.dp)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            isError = state.priceError != null,
            supportingText = state.priceError?.let { { Text(it, color = CampusRed) } },
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CampusLime,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "CAMPUS HANDOFF SPOT",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        ExposedDropdownMenuBox(
            expanded = locExpanded,
            onExpandedChange = { locExpanded = it },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = state.pickupLocation,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = locExpanded) },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CampusLime,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
                ),
                modifier = Modifier
                    .menuAnchor(MenuAnchorType.PrimaryNotEditable, true)
                    .fillMaxWidth()
            )

            ExposedDropdownMenu(
                expanded = locExpanded,
                onDismissRequest = { locExpanded = false },
                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
            ) {
                viewModel.campusLocations.forEach { loc ->
                    DropdownMenuItem(
                        text = { Text(loc, color = MaterialTheme.colorScheme.onSurface) },
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
private fun Step4Review(state: SellFormState) {
    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = CampusLime.copy(alpha = 0.5f),
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "REVIEW CAMPUS LISTING",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = CampusLimeDark,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = state.title,
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onSurface
            )
        )

        Spacer(modifier = Modifier.height(6.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "₹${state.price}",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    color = CampusLimeDark
                )
            )
            ConditionBadge(condition = state.condition)
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Handoff Spot: ${state.pickupLocation}",
            style = MaterialTheme.typography.bodySmall.copy(color = CampusCyanDark)
        )

        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outline)

        Text(
            text = state.description.ifEmpty { "No extra details provided." },
            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
        )
    }
}
