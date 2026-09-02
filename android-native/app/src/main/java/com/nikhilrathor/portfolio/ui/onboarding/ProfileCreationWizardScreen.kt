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

    fun finishProfile(onSuccess: () -> Unit) {
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

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Navigation & Step Indicator
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (state.currentStep in 2..3) {
                        IconButton(
                            onClick = { viewModel.previousStep() },
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(CyberSurfaceVariant)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ArrowBack,
                                contentDescription = "Back",
                                tint = TextPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    } else {
                        Spacer(modifier = Modifier.size(40.dp))
                    }

                    // Progress Indicator (3 Steps)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        (1..3).forEach { step ->
                            val isActive = step == state.currentStep
                            val isCompleted = step < state.currentStep

                            Box(
                                modifier = Modifier
                                    .height(6.dp)
                                    .width(if (isActive) 28.dp else 14.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(
                                        when {
                                            isActive -> CyberLime
                                            isCompleted -> CyberCyan
                                            else -> BorderSubtle
                                        }
                                    )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.size(40.dp))
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (state.currentStep <= 3) {
                    Text(
                        text = "STEP 0${state.currentStep} OF 03 • CAMPUS PROFILE",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = FontFamily.Monospace,
                            color = CyberLime,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                    )
                }
            }

            // Step Body
            Box(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(scrollState)
                    .padding(vertical = 12.dp)
            ) {
                when (state.currentStep) {
                    1 -> Step1NameAvatar(state, viewModel)
                    2 -> Step2BranchYear(state, viewModel)
                    3 -> Step3HostelResidence(state, viewModel)
                    4 -> Step4AllSetConfirmation(state)
                }
            }

            // Bottom CTA
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp)
            ) {
                if (state.currentStep < 4) {
                    NeonButton(
                        text = if (state.currentStep == 3) "Review Profile" else "Next Step",
                        onClick = { viewModel.nextStep() },
                        variant = NeonButtonVariant.LIME,
                        icon = { Icon(Icons.Default.ArrowForward, contentDescription = null, tint = CyberBackground) },
                        modifier = Modifier.fillMaxWidth()
                    )
                } else {
                    NeonButton(
                        text = "🚀 Enter DTU Bazaar",
                        onClick = { viewModel.finishProfile(onNavigateToMain) },
                        variant = NeonButtonVariant.LIME,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}

@Composable
private fun Step1NameAvatar(state: ProfileCreationState, viewModel: ProfileCreationViewModel) {
    val avatars = listOf("⚡", "🎓", "💻", "🎨", "📚", "🚀", "🔬", "🏸")

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "What's your name?",
            style = MaterialTheme.typography.displaySmall.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Fellow DTU students will see this name on your listings and campus chats.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        Text(
            text = "SELECT YOUR AVATAR",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = TextMuted,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            avatars.take(4).forEach { emoji ->
                val isSelected = state.avatarEmoji == emoji
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(54.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (isSelected) CyberLime.copy(alpha = 0.2f) else CyberSurface)
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) CyberLime else BorderSubtle,
                            shape = RoundedCornerShape(14.dp)
                        )
                        .clickable { viewModel.onAvatarChange(emoji) }
                ) {
                    Text(text = emoji, fontSize = 24.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            avatars.drop(4).forEach { emoji ->
                val isSelected = state.avatarEmoji == emoji
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(54.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (isSelected) CyberLime.copy(alpha = 0.2f) else CyberSurface)
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) CyberLime else BorderSubtle,
                            shape = RoundedCornerShape(14.dp)
                        )
                        .clickable { viewModel.onAvatarChange(emoji) }
                ) {
                    Text(text = emoji, fontSize = 24.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = state.name,
            onValueChange = { viewModel.onNameChange(it) },
            label = { Text("Full Name") },
            placeholder = { Text("e.g. Nikhil Rathor") },
            isError = state.nameError != null,
            supportingText = state.nameError?.let { { Text(it, color = ErrorColor) } },
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyberLime,
                unfocusedBorderColor = BorderSubtle,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary,
                focusedContainerColor = CyberSurface,
                unfocusedContainerColor = CyberSurface
            ),
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Step2BranchYear(state: ProfileCreationState, viewModel: ProfileCreationViewModel) {
    var branchExpanded by remember { mutableStateOf(false) }
    var yearExpanded by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Your Branch & Year",
            style = MaterialTheme.typography.displaySmall.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Helps recommend textbooks, drafters, and equipment relevant to your course.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        // Branch Dropdown
        Text(
            text = "ACADEMIC BRANCH / DEPARTMENT",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        ExposedDropdownMenuBox(
            expanded = branchExpanded,
            onExpandedChange = { branchExpanded = !branchExpanded }
        ) {
            OutlinedTextField(
                value = state.branch,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = branchExpanded) },
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
                expanded = branchExpanded,
                onDismissRequest = { branchExpanded = false }
            ) {
                viewModel.branches.forEach { b ->
                    DropdownMenuItem(
                        text = { Text(b, color = TextPrimary) },
                        onClick = {
                            viewModel.onBranchChange(b)
                            branchExpanded = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Year Dropdown
        Text(
            text = "ACADEMIC YEAR",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        ExposedDropdownMenuBox(
            expanded = yearExpanded,
            onExpandedChange = { yearExpanded = !yearExpanded }
        ) {
            OutlinedTextField(
                value = state.year,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = yearExpanded) },
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
                expanded = yearExpanded,
                onDismissRequest = { yearExpanded = false }
            ) {
                viewModel.years.forEach { y ->
                    DropdownMenuItem(
                        text = { Text(y, color = TextPrimary) },
                        onClick = {
                            viewModel.onYearChange(y)
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
private fun Step3HostelResidence(state: ProfileCreationState, viewModel: ProfileCreationViewModel) {
    var hostelExpanded by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Campus Residence",
            style = MaterialTheme.typography.displaySmall.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Enable 0km room-to-room delivery and hostel-gate handoffs.",
            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        // Hosteler vs Day Scholar Toggle Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            CyberCard(
                backgroundColor = if (state.isHosteler) CyberLime.copy(alpha = 0.15f) else CyberSurface,
                borderColor = if (state.isHosteler) CyberLime else BorderSubtle,
                borderWidth = if (state.isHosteler) 2.dp else 1.dp,
                onClick = { viewModel.onHostelerToggle(true) },
                modifier = Modifier.weight(1f)
            ) {
                Text(text = "🏢", fontSize = 24.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Hosteler",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = if (state.isHosteler) CyberLime else TextPrimary
                    )
                )
                Text(text = "Lives on campus", style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary))
            }

            CyberCard(
                backgroundColor = if (!state.isHosteler) CyberCyan.copy(alpha = 0.15f) else CyberSurface,
                borderColor = if (!state.isHosteler) CyberCyan else BorderSubtle,
                borderWidth = if (!state.isHosteler) 2.dp else 1.dp,
                onClick = { viewModel.onHostelerToggle(false) },
                modifier = Modifier.weight(1f)
            ) {
                Text(text = "🚗", fontSize = 24.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Day Scholar",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = if (!state.isHosteler) CyberCyan else TextPrimary
                    )
                )
                Text(text = "Commutes daily", style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary))
            }
        }

        if (state.isHosteler) {
            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "SELECT YOUR HOSTEL",
                style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace, color = TextMuted),
                modifier = Modifier.padding(bottom = 6.dp)
            )

            ExposedDropdownMenuBox(
                expanded = hostelExpanded,
                onExpandedChange = { hostelExpanded = !hostelExpanded }
            ) {
                OutlinedTextField(
                    value = state.hostelName,
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = hostelExpanded) },
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
                    expanded = hostelExpanded,
                    onDismissRequest = { hostelExpanded = false }
                ) {
                    viewModel.hostels.forEach { h ->
                        DropdownMenuItem(
                            text = { Text(h, color = TextPrimary) },
                            onClick = {
                                viewModel.onHostelChange(h)
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
private fun Step4AllSetConfirmation(state: ProfileCreationState) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(CyberLime.copy(alpha = 0.2f))
                .border(2.dp, CyberLime, CircleShape)
        ) {
            Text(text = state.avatarEmoji, fontSize = 36.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "You're All Set!",
            style = MaterialTheme.typography.displaySmall.copy(
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
        )
        Text(
            text = "Welcome to DTU Bazaar, ${state.name}!",
            style = MaterialTheme.typography.bodyLarge.copy(color = CyberLime),
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
                Text(text = "STUDENT", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = state.name, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = TextPrimary))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "BRANCH & YEAR", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = "${state.branch.split("(").first().trim()} • ${state.year.split(" ").first()}", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = CyberCyan))
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "CAMPUS LOCATION", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted))
                Text(text = state.hostelName, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = CyberLime))
            }
        }
    }
}
