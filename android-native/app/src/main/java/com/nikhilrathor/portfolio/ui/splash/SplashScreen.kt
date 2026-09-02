package com.nikhilrathor.portfolio.ui.splash

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class SplashViewModel(private val dataStore: DtuBazaarDataStore) : ViewModel() {
    private val _destination = MutableStateFlow<String?>(null)
    val destination: StateFlow<String?> = _destination

    init {
        viewModelScope.launch {
            delay(1600) // 1.6s animated reveal
            val user = dataStore.userFlow.first()
            if (user != null && user.isOnboarded) {
                _destination.value = "main"
            } else if (user != null && !user.isOnboarded) {
                _destination.value = "onboarding"
            } else {
                _destination.value = "auth"
            }
        }
    }
}

@Composable
fun SplashScreen(
    onNavigateNext: (String) -> Unit,
    viewModel: SplashViewModel
) {
    val destination by viewModel.destination.collectAsState()

    LaunchedEffect(destination) {
        destination?.let { onNavigateNext(it) }
    }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBackground),
        contentAlignment = Alignment.Center
    ) {
        // Radial ambient glow
        Box(
            modifier = Modifier
                .size(340.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(CyberLime.copy(alpha = 0.18f), Color.Transparent)
                    )
                )
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Animated Lightning Bolt Badge
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(80.dp)
                    .scale(scale)
                    .clip(CircleShape)
                    .background(CyberLime)
            ) {
                Icon(
                    imageVector = Icons.Default.Bolt,
                    contentDescription = "DTU Bazaar Logo",
                    tint = CyberBackground,
                    modifier = Modifier.size(48.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Main Brand Title
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "DTU BAZAAR",
                    style = MaterialTheme.typography.displayMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        letterSpacing = (-0.5).sp
                    )
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Tagline: OLX for DTU
            Text(
                text = "OLX FOR DTU",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontFamily = FontFamily.Monospace,
                    color = CyberLime,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp
                )
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Verified DTU Students Marketplace",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = TextSecondary
                )
            )
        }

        // Bottom campus tag
        Text(
            text = "DELHI TECHNOLOGICAL UNIVERSITY",
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                color = TextMuted,
                fontSize = 9.sp
            ),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 32.dp)
        )
    }
}
