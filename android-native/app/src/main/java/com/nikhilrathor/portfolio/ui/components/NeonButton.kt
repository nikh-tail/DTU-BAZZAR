package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.*

enum class NeonButtonVariant {
    PURPLE,
    CYAN,
    LIME,
    GHOST,
    OUTLINE
}

@Composable
fun NeonButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: NeonButtonVariant = NeonButtonVariant.PURPLE,
    icon: (@Composable () -> Unit)? = null,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    height: Dp = 52.dp
) {
    val shape = RoundedCornerShape(16.dp)

    when (variant) {
        NeonButtonVariant.PURPLE -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyberPurple,
                    contentColor = Color.White,
                    disabledContainerColor = CyberSurfaceVariant,
                    disabledContentColor = TextMuted
                ),
                contentPadding = PaddingValues(horizontal = 24.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, Color.White)
            }
        }
        NeonButtonVariant.CYAN -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyberCyan,
                    contentColor = CyberBackground,
                    disabledContainerColor = CyberSurfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 24.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, CyberBackground)
            }
        }
        NeonButtonVariant.LIME -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyberLime,
                    contentColor = CyberBackground,
                    disabledContainerColor = CyberSurfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 24.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, CyberBackground)
            }
        }
        NeonButtonVariant.OUTLINE -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyberSurfaceVariant,
                    contentColor = TextPrimary
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderMedium),
                contentPadding = PaddingValues(horizontal = 20.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, TextPrimary)
            }
        }
        NeonButtonVariant.GHOST -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Transparent,
                    contentColor = TextSecondary
                ),
                contentPadding = PaddingValues(horizontal = 16.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, TextSecondary)
            }
        }
    }
}

@Composable
private fun ButtonContent(
    text: String,
    icon: (@Composable () -> Unit)?,
    isLoading: Boolean,
    textColor: Color
) {
    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier.height(20.dp).width(20.dp),
            strokeWidth = 2.dp,
            color = textColor
        )
    } else {
        Row(verticalAlignment = Alignment.CenterVertically) {
            icon?.let {
                it()
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                style = MaterialTheme.typography.labelLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = textColor,
                    letterSpacing = 0.5.sp
                )
            )
        }
    }
}
