package com.nikhilrathor.portfolio.ui.onboarding

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.User
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ProfileCreationState(
    val currentStep: Int = 1, // 1 to 3 + 4 (confirmation)
    val name: String = "",
    val avatarEmoji: String = "⚡",
    val branch: String = "Computer Science (CSE)",
    val year: String = "3rd Year",
    val isHosteler: Boolean = true,
    val hostelName: String = "Sir JC Bose Hostel (BH-2)",
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
    val years = listOf("1st Year (Freshers)", "2nd Year (Sophomores)", "3rd Year (Juniors)", "4th Year (Seniors)")

    fun onNameChange(name: String) {
        _state.value = _state.value.copy(name = name, nameError = null)
    }

    fun onAvatarChange(avatar: String) {
        _state.value = _state.value.copy(avatarEmoji = avatar)
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

    fun nextStep() {
        val s = _state.value
        if (s.currentStep == 1 && s.name.trim().isEmpty()) {
            _state.value = s.copy(nameError = "Please enter your name")
            return
        }
        if (s.currentStep < 4) {
            _state.value = s.copy(currentStep = s.currentStep + 1)
        }
    }

    fun previousStep() {
        if (_state.value.currentStep > 1) {
            _state.value = _state.value.copy(currentStep = _state.value.currentStep - 1)
        }
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
                avatarEmoji = s.avatarEmoji
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

    val avatars = listOf("⚡", "🎓", "💻", "🎨", "📚", "🚀", "🔬", "🏸")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(scrollState)
            .padding(horizontal = 20.dp, vertical = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Step Indicator Dots
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 16.dp)
        ) {
            (1..3).forEach { stepIndex ->
                val isActive = stepIndex <= state.currentStep
                Box(
                    modifier = Modifier
                        .height(6.dp)
                        .width(if (stepIndex == state.currentStep) 28.dp else 14.dp)
                        .clip(RoundedCornerShape(3.dp))
                        .background(if (isActive) CampusLime else MaterialTheme.colorScheme.outline)
                )
            }
        }

        Text(
            text = "STEP ${state.currentStep} OF 3",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = CampusLimeDark,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = when (state.currentStep) {
                1 -> "Setup Campus Identity"
                2 -> "Academic Department"
                3 -> "Hostel / Residence"
                else -> "You're All Set! 🎉"
            },
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground
            )
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Step Content Cards
        AnimatedContent(
            targetState = state.currentStep,
            label = "wizard_step"
        ) { step ->
            when (step) {
                1 -> Step1Identity(state, avatars, viewModel)
                2 -> Step2Academics(state, viewModel)
                3 -> Step3Residence(state, viewModel)
                4 -> Step4Summary(state, viewModel, onNavigateToMain)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Navigation CTA Row
        if (state.currentStep < 4) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (state.currentStep > 1) {
                    NeonButton(
                        text = "Back",
                        onClick = { viewModel.previousStep() },
                        variant = NeonButtonVariant.OUTLINE,
                        icon = { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface) },
                        modifier = Modifier.weight(1f)
                    )
                }

                NeonButton(
                    text = if (state.currentStep == 3) "Finish Setup" else "Continue",
                    onClick = { viewModel.nextStep() },
                    variant = NeonButtonVariant.LIME,
                    icon = { Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = DarkBackground) },
                    modifier = Modifier.weight(1.5f)
                )
            }
        }
    }
}

@Composable
private fun Step1Identity(
    state: ProfileCreationState,
    avatars: List<String>,
    viewModel: ProfileCreationViewModel
) {
    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = MaterialTheme.colorScheme.outline,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "YOUR FULL NAME",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        OutlinedTextField(
            value = state.name,
            onValueChange = { viewModel.onNameChange(it) },
            placeholder = { Text("e.g. Nikhil Rathor", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)) },
            isError = state.nameError != null,
            supportingText = state.nameError?.let { { Text(it, color = CampusRed) } },
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
            text = "CHOOSE AVATAR BADGE",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            avatars.forEach { emoji ->
                val isSelected = state.avatarEmoji == emoji
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(if (isSelected) CampusLime.copy(alpha = 0.25f) else MaterialTheme.colorScheme.surfaceVariant)
                        .border(1.5.dp, if (isSelected) CampusLime else Color.Transparent, CircleShape)
                        .clickable { viewModel.onAvatarChange(emoji) }
                ) {
                    Text(text = emoji, fontSize = 18.sp)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Step2Academics(
    state: ProfileCreationState,
    viewModel: ProfileCreationViewModel
) {
    var branchExpanded by remember { mutableStateOf(false) }
    var yearExpanded by remember { mutableStateOf(false) }

    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = MaterialTheme.colorScheme.outline,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "BRANCH / COURSE",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
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
                expanded = branchExpanded,
                onDismissRequest = { branchExpanded = false },
                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
            ) {
                viewModel.branches.forEach { branch ->
                    DropdownMenuItem(
                        text = { Text(branch, color = MaterialTheme.colorScheme.onSurface) },
                        onClick = {
                            viewModel.onBranchChange(branch)
                            branchExpanded = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "ACADEMIC YEAR",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
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
                expanded = yearExpanded,
                onDismissRequest = { yearExpanded = false },
                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
            ) {
                viewModel.years.forEach { yr ->
                    DropdownMenuItem(
                        text = { Text(yr, color = MaterialTheme.colorScheme.onSurface) },
                        onClick = {
                            viewModel.onYearChange(yr)
                            yearExpanded = false
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Step3Residence(
    state: ProfileCreationState,
    viewModel: ProfileCreationViewModel
) {
    var hostelExpanded by remember { mutableStateOf(false) }

    CyberCard(
        backgroundColor = MaterialTheme.colorScheme.surface,
        borderColor = MaterialTheme.colorScheme.outline,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "CAMPUS RESIDENCE TYPE",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (state.isHosteler) CampusLime.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant)
                    .border(1.5.dp, if (state.isHosteler) CampusLime else MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                    .clickable { viewModel.onHostelerToggle(true) }
                    .padding(vertical = 12.dp)
            ) {
                Text(
                    text = "🏢 Hosteler",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = if (state.isHosteler) FontWeight.Bold else FontWeight.Normal,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
            }

            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (!state.isHosteler) CampusLime.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant)
                    .border(1.5.dp, if (!state.isHosteler) CampusLime else MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                    .clickable { viewModel.onHostelerToggle(false) }
                    .padding(vertical = 12.dp)
            ) {
                Text(
                    text = "🚗 Day Scholar",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = if (!state.isHosteler) FontWeight.Bold else FontWeight.Normal,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
        }

        if (state.isHosteler) {
            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "SELECT HOSTEL",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold
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
                    expanded = hostelExpanded,
                    onDismissRequest = { hostelExpanded = false },
                    modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                ) {
                    viewModel.hostels.forEach { hst ->
                        DropdownMenuItem(
                            text = { Text(hst, color = MaterialTheme.colorScheme.onSurface) },
                            onClick = {
                                viewModel.onHostelChange(hst)
                                hostelExpanded = false
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun Step4Summary(
    state: ProfileCreationState,
    viewModel: ProfileCreationViewModel,
    onNavigateToMain: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        CyberCard(
            backgroundColor = MaterialTheme.colorScheme.surface,
            borderColor = CampusLime.copy(alpha = 0.5f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .border(2.dp, CampusLime, CircleShape)
                ) {
                    Text(text = state.avatarEmoji, fontSize = 32.sp)
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = state.name.ifEmpty { "DTU Student" },
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )

                Text(
                    text = "${state.branch} • ${state.year}",
                    style = MaterialTheme.typography.bodySmall.copy(color = CampusCyanDark)
                )
                Text(
                    text = state.hostelName,
                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outline)

                Text(
                    text = "⚡ Your verified student account is ready. Start exploring campus listings or post your own in 60 seconds.",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        lineHeight = 16.sp
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        NeonButton(
            text = "Enter DTU Bazaar",
            onClick = { viewModel.completeProfile(onNavigateToMain) },
            variant = NeonButtonVariant.LIME,
            icon = { Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = DarkBackground) },
            modifier = Modifier.fillMaxWidth()
        )
    }
}
