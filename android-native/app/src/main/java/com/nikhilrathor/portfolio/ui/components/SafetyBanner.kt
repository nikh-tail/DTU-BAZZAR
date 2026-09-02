package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.CampusCyanDark
import com.nikhilrathor.portfolio.theme.CampusCyanLight
import com.nikhilrathor.portfolio.theme.CampusLimeDark

@Composable
fun CampusSafetyBanner(
    modifier: Modifier = Modifier
) {
    val isDark = MaterialTheme.colorScheme.background.value != 0xFFF7F8FA.toULong()

    val bgColor = if (isDark) MaterialTheme.colorScheme.surface else CampusCyanLight
    val borderColor = if (isDark) MaterialTheme.colorScheme.outline else Color(0xFFBAE6FD)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .border(1.dp, borderColor, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.Top,
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(CampusCyanDark.copy(alpha = 0.15f))
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "Campus Safety",
                    tint = CampusCyanDark,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "DTU Campus Safety Tips 🛡️",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "Always meet at public campus spots (Mic-Mac Canteen, OAT, Library Lawn, or Hostel Gates). Test electronic gear and verify books before paying via UPI.",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 16.sp
                    )
                )
            }
        }
    }
}
