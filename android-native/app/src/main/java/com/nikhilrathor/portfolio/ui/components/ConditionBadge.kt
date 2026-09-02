package com.nikhilrathor.portfolio.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.nikhilrathor.portfolio.data.models.ItemCondition
import com.nikhilrathor.portfolio.theme.*

@Composable
fun ConditionBadge(
    condition: ItemCondition,
    modifier: Modifier = Modifier
) {
    val isDark = MaterialTheme.colorScheme.background.value != 0xFFF7F8FA.toULong()

    val (bgColor, textColor) = when (condition) {
        ItemCondition.LIKE_NEW -> {
            if (isDark) Pair(CampusCyan.copy(alpha = 0.2f), CampusCyan)
            else Pair(CampusCyanLight, CampusCyanDark)
        }
        ItemCondition.GOOD -> {
            if (isDark) Pair(CampusGreen.copy(alpha = 0.2f), CampusGreen)
            else Pair(CampusGreenLight, CampusGreenDark)
        }
        ItemCondition.FAIR -> {
            if (isDark) Pair(CampusAmber.copy(alpha = 0.2f), CampusAmber)
            else Pair(CampusAmberLight, CampusAmberDark)
        }
        ItemCondition.REFURBISHED -> {
            if (isDark) Pair(CampusPurple.copy(alpha = 0.2f), CampusPurple)
            else Pair(CampusPurpleLight, CampusPurpleDark)
        }
    }

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .height(22.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .padding(horizontal = 7.dp)
    ) {
        Text(
            text = condition.label,
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
