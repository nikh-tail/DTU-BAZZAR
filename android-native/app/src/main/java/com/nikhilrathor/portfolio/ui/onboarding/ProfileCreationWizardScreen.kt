package com.nikhilrathor.portfolio.ui.onboarding

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

// Design Tokens
private val DeepInkBg = Color(0xFF0B0D12)
private val GlassSurfaceBg = Color(0x14FFFFFF)
private val GlassBorder = Color(0x24FFFFFF)
private val DropdownBg = Color(0xFF141821)
private val TextPrimary = Color(0xFFEDEFF3)
private val TextMuted = Color(0xFF8A93A3)
private val TextSecondaryMuted = Color(0xFF6B7688)
private val AccentAmber = Color(0xFFE8A23D)
private val AccentDarkInk = Color(0xFF241705)
private val SuccessGreen = Color(0xFF34D399)
private val ErrorRed = Color(0xFFFF5C5C)

data class ProfileCreationState(
    val isConfirmed: Boolean = false,
    val name: String = "",
    val branch: String = "Computer Science & Engineering (COE)",
    val year: String = "2nd Year",
    val isHosteler: Boolean = true,
    val hostelName: String = "Sir JC Bose Hostel",
    val nameError: String? = null
)

class ProfileCreationViewModel(
    private val dataStore: DtuBazaarDataStore,
    private val repository: DtuBazaarRepository
) : ViewModel() {
    private val _state = MutableStateFlow(ProfileCreationState())
    val state: StateFlow<ProfileCreationState> = _state

    val branches = repository.dtuBranches
    val hostels = repository.dtuHostels
    val years = listOf("1st Year", "2nd Year", "3rd Year", "4th Year", "M.Tech / PhD")

    fun onNameChange(name: String) {
        _state.value = _state.value.copy(name = name, nameError = null)
    }

    fun onBranchChange(branch: String) {
        _state.value = _state.value.copy(branch = branch)
    }

    fun onYearChange(year: String) {
        _state.value = _state.value.copy(year = year)
    }

    fun onHostelerToggle(isHosteler: Boolean) {
        _state.value = _state.value.copy(
            isHosteler = isHosteler,
            hostelName = if (isHosteler) hostels.first() else "Day Scholar"
        )
    }

    fun onHostelChange(hostel: String) {
        _state.value = _state.value.copy(hostelName = hostel)
    }

    fun finishSetup() {
        val s = _state.value
        if (s.name.trim().isEmpty()) {
            _state.value = s.copy(nameError = "Please enter your full name")
            return
        }
        _state.value = s.copy(isConfirmed = true)
    }

    fun completeProfile(onSuccess: () -> Unit) {
        val s = _state.value
        viewModelScope.launch {
            dataStore.saveUserProfile(
                name = s.name.ifEmpty { "DTU Student" },
                branch = s.branch,
                year = s.year,
                isHosteler = s.isHosteler,
                hostelName = s.hostelName,
                avatarEmoji = "🎓"
            )
            onSuccess()
        }
    }
}

@Composable
fun ProfileCreationWizardScreen(
    onNavigateToMain: () -> Unit,
    viewModel: ProfileCreationViewModel
) {
    val state by viewModel.state.collectAsState()
    val scrollState = rememberScrollState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepInkBg)
    ) {
        // Dual ambient radial-gradient glows (amber top-left, green top-right)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(AccentAmber.copy(alpha = 0.13f), Color.Transparent),
                        center = androidx.compose.ui.geometry.Offset(200f, 150f),
                        radius = 600f
                    )
                )
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(SuccessGreen.copy(alpha = 0.12f), Color.Transparent),
                        center = androidx.compose.ui.geometry.Offset(900f, 120f),
                        radius = 650f
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .verticalScroll(scrollState)
                .padding(horizontal = 20.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            AnimatedContent(
                targetState = state.isConfirmed,
                label = "onboarding_screen"
            ) { isConfirmed ->
                if (!isConfirmed) {
                    CampusIdentityCard(state, viewModel)
                } else {
                    ConfirmationCard(state, viewModel, onNavigateToMain)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CampusIdentityCard(
    state: ProfileCreationState,
    viewModel: ProfileCreationViewModel
) {
    var branchExpanded by remember { mutableStateOf(false) }
    var yearExpanded by remember { mutableStateOf(false) }
    var hostelExpanded by remember { mutableStateOf(false) }

    Surface(
        shape = RoundedCornerShape(22.dp),
        color = GlassSurfaceBg,
        border = androidx.compose.foundation.BorderStroke(1.dp, GlassBorder),
        shadowElevation = 16.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(26.dp)
        ) {
            // Header
            Text(
                text = "Campus identity",
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            )
            Text(
                text = "Set up your student profile to trade and connect with peers.",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = TextMuted
                ),
                modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
            )

            // 1. Full name
            Text(
                text = "Full name",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier.padding(bottom = 6.dp)
            )
            OutlinedTextField(
                value = state.name,
                onValueChange = { viewModel.onNameChange(it) },
                placeholder = { Text("e.g. Rohan Sharma", color = Color(0xFF5A6270)) },
                isError = state.nameError != null,
                supportingText = state.nameError?.let { { Text(it, color = ErrorRed, fontSize = 11.sp) } },
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentAmber,
                    unfocusedBorderColor = GlassBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    focusedContainerColor = GlassSurfaceBg,
                    unfocusedContainerColor = GlassSurfaceBg
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 2. Branch / course
            Text(
                text = "Branch / course",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier.padding(bottom = 6.dp)
            )
            ExposedDropdownMenuBox(
                expanded = branchExpanded,
                onExpandedChange = { branchExpanded = it },
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = state.branch,
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = branchExpanded) },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentAmber,
                        unfocusedBorderColor = GlassBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary,
                        focusedContainerColor = GlassSurfaceBg,
                        unfocusedContainerColor = GlassSurfaceBg
                    ),
                    modifier = Modifier
                        .menuAnchor(MenuAnchorType.PrimaryNotEditable, true)
                        .fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = branchExpanded,
                    onDismissRequest = { branchExpanded = false },
                    modifier = Modifier.background(DropdownBg)
                ) {
                    viewModel.branches.forEach { b ->
                        DropdownMenuItem(
                            text = { Text(b, color = TextPrimary, fontSize = 12.sp) },
                            onClick = {
                                viewModel.onBranchChange(b)
                                branchExpanded = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 3. Academic year
            Text(
                text = "Academic year",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier.padding(bottom = 6.dp)
            )
            ExposedDropdownMenuBox(
                expanded = yearExpanded,
                onExpandedChange = { yearExpanded = it },
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = state.year,
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = yearExpanded) },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentAmber,
                        unfocusedBorderColor = GlassBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary,
                        focusedContainerColor = GlassSurfaceBg,
                        unfocusedContainerColor = GlassSurfaceBg
                    ),
                    modifier = Modifier
                        .menuAnchor(MenuAnchorType.PrimaryNotEditable, true)
                        .fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = yearExpanded,
                    onDismissRequest = { yearExpanded = false },
                    modifier = Modifier.background(DropdownBg)
                ) {
                    viewModel.years.forEach { y ->
                        DropdownMenuItem(
                            text = { Text(y, color = TextPrimary, fontSize = 12.sp) },
                            onClick = {
                                viewModel.onYearChange(y)
                                yearExpanded = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 4. Residence type — Two-option toggle
            Text(
                text = "Residence type",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier.padding(bottom = 6.dp)
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(9.dp))
                        .background(if (state.isHosteler) AccentAmber.copy(alpha = 0.12f) else GlassSurfaceBg)
                        .border(1.dp, if (state.isHosteler) AccentAmber else GlassBorder, RoundedCornerShape(9.dp))
                        .clickable { viewModel.onHostelerToggle(true) }
                        .padding(vertical = 12.dp)
                ) {
                    Text(
                        text = "🏢 Hosteler",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = if (state.isHosteler) AccentAmber else TextMuted,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }

                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(9.dp))
                        .background(if (!state.isHosteler) AccentAmber.copy(alpha = 0.12f) else GlassSurfaceBg)
                        .border(1.dp, if (!state.isHosteler) AccentAmber else GlassBorder, RoundedCornerShape(9.dp))
                        .clickable { viewModel.onHostelerToggle(false) }
                        .padding(vertical = 12.dp)
                ) {
                    Text(
                        text = "🚗 Day scholar",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = if (!state.isHosteler) AccentAmber else TextMuted,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            // 5. Hostel selection — Only visible when Hosteler is selected
            if (state.isHosteler) {
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = "Hostel name",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextMuted,
                        fontWeight = FontWeight.Medium
                    ),
                    modifier = Modifier.padding(bottom = 6.dp)
                )
                ExposedDropdownMenuBox(
                    expanded = hostelExpanded,
                    onExpandedChange = { hostelExpanded = it },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = state.hostelName,
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = hostelExpanded) },
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AccentAmber,
                            unfocusedBorderColor = GlassBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedContainerColor = GlassSurfaceBg,
                            unfocusedContainerColor = GlassSurfaceBg
                        ),
                        modifier = Modifier
                            .menuAnchor(MenuAnchorType.PrimaryNotEditable, true)
                            .fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = hostelExpanded,
                        onDismissRequest = { hostelExpanded = false },
                        modifier = Modifier.background(DropdownBg)
                    ) {
                        viewModel.hostels.forEach { h ->
                            DropdownMenuItem(
                                text = { Text(h, color = TextPrimary, fontSize = 12.sp) },
                                onClick = {
                                    viewModel.onHostelChange(h)
                                    hostelExpanded = false
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Single Finish setup primary button (full width)
            Button(
                onClick = { viewModel.finishSetup() },
                shape = RoundedCornerShape(9.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AccentAmber,
                    contentColor = AccentDarkInk
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(
                    text = "Finish setup",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        color = AccentDarkInk,
                        fontSize = 14.sp
                    )
                )
                Spacer(modifier = Modifier.width(6.dp))
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = AccentDarkInk, modifier = Modifier.size(16.dp))
            }
        }
    }
}

@Composable
private fun ConfirmationCard(
    state: ProfileCreationState,
    viewModel: ProfileCreationViewModel,
    onNavigateToMain: () -> Unit
) {
    val initial = state.name.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "U"

    Surface(
        shape = RoundedCornerShape(22.dp),
        color = GlassSurfaceBg,
        border = androidx.compose.foundation.BorderStroke(1.dp, GlassBorder),
        shadowElevation = 16.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(26.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Small square avatar tile showing initial in green
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(SuccessGreen.copy(alpha = 0.12f))
                    .border(1.dp, SuccessGreen, RoundedCornerShape(16.dp))
            ) {
                Text(
                    text = initial,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = SuccessGreen
                    )
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Full name as heading
            Text(
                text = state.name,
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                ),
                textAlign = TextAlign.Center
            )

            // Branch + year as line 1
            Text(
                text = "${state.branch} • ${state.year}",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 4.dp)
            )

            // Hostel name (or "Day scholar") as line 2
            Text(
                text = if (state.isHosteler) "🏢 ${state.hostelName}" else "🚗 Day scholar",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = TextSecondaryMuted,
                    fontSize = 11.sp
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 2.dp)
            )

            // Reassurance note line
            Text(
                text = "Your campus profile is ready. You can now browse verified listings, message campus peers, and post items with 0% brokerage.",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = TextMuted,
                    lineHeight = 16.sp
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 20.dp, bottom = 24.dp)
            )

            // Enter DTU Bazaar button
            Button(
                onClick = {
                    viewModel.completeProfile(onNavigateToMain)
                },
                shape = RoundedCornerShape(9.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AccentAmber,
                    contentColor = AccentDarkInk
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(
                    text = "Enter DTU Bazaar",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        color = AccentDarkInk,
                        fontSize = 14.sp
                    )
                )
                Spacer(modifier = Modifier.width(6.dp))
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = AccentDarkInk, modifier = Modifier.size(16.dp))
            }
        }
    }
}
