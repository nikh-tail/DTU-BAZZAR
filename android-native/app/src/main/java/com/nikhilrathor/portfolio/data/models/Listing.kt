package com.nikhilrathor.portfolio.data.models

data class Listing(
    val id: String,
    val title: String,
    val description: String,
    val price: Int,
    val originalPrice: Int? = null,
    val category: ListingCategory,
    val condition: ItemCondition,
    val imageUrls: List<String>,
    val pickupLocation: String,
    val seller: User,
    val isSold: Boolean = false,
    val isSaved: Boolean = false,
    val viewsCount: Int = 124,
    val createdAt: String = "2 hours ago",
    val tags: List<String> = emptyList()
)
