package com.nikhilrathor.portfolio.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = CyberPurple,
    onPrimary = CyberBackground,
    primaryContainer = CyberSurfaceVariant,
    onPrimaryContainer = CyberPurpleLight,
    secondary = CyberCyan,
    onSecondary = CyberBackground,
    secondaryContainer = CyberSurfaceVariant,
    onSecondaryContainer = CyberCyan,
    tertiary = CyberLime,
    onTertiary = CyberBackground,
    background = CyberBackground,
    onBackground = TextPrimary,
    surface = CyberSurface,
    onSurface = TextPrimary,
    surfaceVariant = CyberSurfaceVariant,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle,
    outlineVariant = BorderMedium,
    error = ErrorColor,
    onError = TextPrimary
)

@Composable
fun NikhilRathorPortfolioTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = CyberBackground.toArgb()
            window.navigationBarColor = CyberSurface.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = CyberTypography,
        content = content
    )
}
