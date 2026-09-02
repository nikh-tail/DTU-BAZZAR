package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.*

enum class NeonButtonVariant {
    LIME,
    CYAN,
    PURPLE,
    OUTLINE,
    GHOST,
    WHATSAPP
}

@Composable
fun NeonButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: NeonButtonVariant = NeonButtonVariant.LIME,
    icon: (@Composable () -> Unit)? = null,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    height: Dp = 48.dp
) {
    val shape = RoundedCornerShape(14.dp)

    when (variant) {
        NeonButtonVariant.LIME -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CampusLime,
                    contentColor = DarkBackground,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    disabledContentColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 16.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, DarkBackground)
            }
        }
        NeonButtonVariant.WHATSAPP -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF25D366),
                    contentColor = Color.White,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 16.dp),
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
                    containerColor = CampusCyan,
                    contentColor = DarkBackground,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 16.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, DarkBackground)
            }
        }
        NeonButtonVariant.PURPLE -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CampusPurple,
                    contentColor = Color.White,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 16.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, Color.White)
            }
        }
        NeonButtonVariant.OUTLINE -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface
                ),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                contentPadding = PaddingValues(horizontal = 16.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, MaterialTheme.colorScheme.onSurface)
            }
        }
        NeonButtonVariant.GHOST -> {
            Button(
                onClick = onClick,
                enabled = enabled && !isLoading,
                shape = shape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Transparent,
                    contentColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 12.dp),
                modifier = modifier.height(height)
            ) {
                ButtonContent(text, icon, isLoading, MaterialTheme.colorScheme.onSurfaceVariant)
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
            modifier = Modifier.size(20.dp),
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
                    letterSpacing = 0.2.sp
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
