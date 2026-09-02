package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nikhilrathor.portfolio.theme.CampusGreenDark
import com.nikhilrathor.portfolio.theme.CampusLime

@Composable
fun VerifiedDtuBadge(
    modifier: Modifier = Modifier,
    text: String = "Verified DTU Student"
) {
    val isDark = MaterialTheme.colorScheme.background.value != 0xFFF7F8FA.toULong()
    val badgeBg = if (isDark) CampusLime.copy(alpha = 0.14f) else Color(0xFFDCFCE7)
    val badgeBorder = if (isDark) CampusLime.copy(alpha = 0.45f) else Color(0xFF86EFAC)
    val textColor = if (isDark) CampusLime else CampusGreenDark
    val iconColor = if (isDark) CampusLime else CampusGreenDark

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .height(24.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(badgeBg)
            .border(1.dp, badgeBorder, RoundedCornerShape(12.dp))
            .padding(horizontal = 8.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Verified,
            contentDescription = "Verified",
            tint = iconColor,
            modifier = Modifier.size(13.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                color = textColor,
                fontWeight = FontWeight.Bold,
                fontSize = 10.sp
            ),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
