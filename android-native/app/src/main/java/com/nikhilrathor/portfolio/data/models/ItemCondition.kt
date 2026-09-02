package com.nikhilrathor.portfolio.data.models

enum class ItemCondition(val label: String, val badgeColorHex: Long) {
    LIKE_NEW("Like New", 0xFF06B6D4), // Cyan
    GOOD("Good", 0xFF10B981),        // Green
    FAIR("Fair", 0xFFF59E0B),        // Amber
    REFURBISHED("Refurbished", 0xFFA855F7) // Purple
}
