package com.nikhilrathor.portfolio.ui.auth

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
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
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.theme.*
import com.nikhilrathor.portfolio.ui.components.CyberCard
import com.nikhilrathor.portfolio.ui.components.NeonButton
import com.nikhilrathor.portfolio.ui.components.NeonButtonVariant
import com.nikhilrathor.portfolio.ui.components.VerifiedDtuBadge
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class AuthState(
    val email: String = "",
    val otp: String = "",
    val isOtpSent: Boolean = false,
    val emailError: String? = null,
    val otpError: String? = null,
    val isLoading: Boolean = false,
    val resendCountdown: Int = 45,
    val canResend: Boolean = false
)

class AuthViewModel(private val dataStore: DtuBazaarDataStore) : ViewModel() {
    private val _state = MutableStateFlow(AuthState())
    val state: StateFlow<AuthState> = _state

    fun onEmailChange(email: String) {
        _state.value = _state.value.copy(email = email.trim(), emailError = null)
    }

    fun onOtpChange(otp: String) {
        if (otp.length <= 6) {
            _state.value = _state.value.copy(otp = otp, otpError = null)
        }
    }

    fun requestOtp() {
        val email = _state.value.email.trim()
        if (email.isEmpty()) {
            _state.value = _state.value.copy(emailError = "Please enter your college email")
            return
        }

        // Validate @dtu.ac.in domain requirement
        if (!email.endsWith("@dtu.ac.in", ignoreCase = true) && !email.contains("@dtu.ac.in", ignoreCase = true)) {
            _state.value = _state.value.copy(
                emailError = "Access Restricted: Please enter your official @dtu.ac.in email address"
            )
            return
        }

        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            delay(700)
            _state.value = _state.value.copy(
                isLoading = false,
                isOtpSent = true,
                resendCountdown = 45,
                canResend = false
            )
            startResendTimer()
        }
    }

    fun verifyOtp(onSuccess: () -> Unit) {
        val otp = _state.value.otp.trim()
        if (otp.length != 6) {
            _state.value = _state.value.copy(otpError = "Please enter the 6-digit OTP")
            return
        }

        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            delay(600)
            dataStore.saveAuthSession(_state.value.email)
            _state.value = _state.value.copy(isLoading = false)
            onSuccess()
        }
    }

    private fun startResendTimer() {
        viewModelScope.launch {
            while (_state.value.resendCountdown > 0) {
                delay(1000)
                _state.value = _state.value.copy(resendCountdown = _state.value.resendCountdown - 1)
            }
            _state.value = _state.value.copy(canResend = true)
        }
    }

    fun backToEmail() {
        _state.value = _state.value.copy(isOtpSent = false, otp = "", otpError = null)
    }
}

@Composable
fun AuthScreen(
    onNavigateToProfileCreation: () -> Unit,
    viewModel: AuthViewModel
) {
    val state by viewModel.state.collectAsState()
    val scrollState = rememberScrollState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Brand Mark & Trust Badge
            VerifiedDtuBadge(text = "🛡️ Verified DTU Students Only")

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "DTU BAZAAR",
                style = MaterialTheme.typography.displaySmall.copy(
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onBackground
                )
            )

            Text(
                text = if (!state.isOtpSent) "Login with your DTU Roll / College Email" else "Enter 6-Digit Campus Verification Code",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
            )

            AnimatedContent(
                targetState = state.isOtpSent,
                label = "auth_stage"
            ) { isOtpSent ->
                if (!isOtpSent) {
                    // Email Input Stage
                    Column(modifier = Modifier.fillMaxWidth()) {
                        CyberCard(
                            backgroundColor = MaterialTheme.colorScheme.surface,
                            borderColor = MaterialTheme.colorScheme.outline,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "COLLEGE EMAIL ADDRESS",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.Bold
                                ),
                                modifier = Modifier.padding(bottom = 8.dp)
                            )

                            OutlinedTextField(
                                value = state.email,
                                onValueChange = { viewModel.onEmailChange(it) },
                                placeholder = { Text("e.g. 2k22_co_123@dtu.ac.in", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)) },
                                leadingIcon = { Icon(Icons.Default.School, contentDescription = null, tint = CampusLime) },
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Email,
                                    imeAction = ImeAction.Done
                                ),
                                keyboardActions = KeyboardActions(onDone = { viewModel.requestOtp() }),
                                isError = state.emailError != null,
                                supportingText = state.emailError?.let { { Text(it, color = CampusRed, fontSize = 11.sp) } },
                                singleLine = true,
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = CampusLime,
                                    unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                                    focusedTextColor = MaterialTheme.colorScheme.onSurface,
                                    unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
                                    focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
                                ),
                                modifier = Modifier.fillMaxWidth()
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Lock,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Secure passwordless login. We send a 6-digit OTP.",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        NeonButton(
                            text = "Send College OTP",
                            onClick = { viewModel.requestOtp() },
                            isLoading = state.isLoading,
                            variant = NeonButtonVariant.LIME,
                            icon = { Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = DarkBackground) },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                } else {
                    // OTP Verification Stage
                    Column(modifier = Modifier.fillMaxWidth()) {
                        CyberCard(
                            backgroundColor = MaterialTheme.colorScheme.surface,
                            borderColor = CampusLime.copy(alpha = 0.5f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "OTP SENT TO",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = FontFamily.Monospace,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    )
                                    Text(
                                        text = state.email,
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            color = CampusLimeDark,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        maxLines = 1
                                    )
                                }

                                TextButton(onClick = { viewModel.backToEmail() }) {
                                    Text("Change", color = CampusCyan, fontSize = 12.sp)
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            OutlinedTextField(
                                value = state.otp,
                                onValueChange = { viewModel.onOtpChange(it) },
                                placeholder = { Text("• • • • • •", letterSpacing = 8.sp, textAlign = TextAlign.Center) },
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.NumberPassword,
                                    imeAction = ImeAction.Done
                                ),
                                keyboardActions = KeyboardActions(onDone = { viewModel.verifyOtp(onNavigateToProfileCreation) }),
                                isError = state.otpError != null,
                                supportingText = state.otpError?.let { { Text(it, color = CampusRed) } },
                                textStyle = MaterialTheme.typography.headlineMedium.copy(
                                    textAlign = TextAlign.Center,
                                    letterSpacing = 8.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.onSurface
                                ),
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

                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.Center
                            ) {
                                if (!state.canResend) {
                                    Text(
                                        text = "Resend code in ${state.resendCountdown}s",
                                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    )
                                } else {
                                    Text(
                                        text = "Resend Code",
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = CampusCyan,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        modifier = Modifier.clickable { viewModel.requestOtp() }
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        NeonButton(
                            text = "Verify & Enter App",
                            onClick = { viewModel.verifyOtp(onNavigateToProfileCreation) },
                            isLoading = state.isLoading,
                            variant = NeonButtonVariant.LIME,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Zero Commission Subtext
            Text(
                text = "⚡ 100% Peer-to-Peer • 0% Commission • 0km Campus Delivery",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 10.sp
                ),
                textAlign = TextAlign.Center
            )
        }
    }
}
