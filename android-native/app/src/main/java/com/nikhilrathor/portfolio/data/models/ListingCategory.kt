package com.nikhilrathor.portfolio.data.models

enum class ListingCategory(val id: String, val title: String, val icon: String) {
    DRAWING_TOOLS("DRAWING_TOOLS", "Drawing Tools", "📐"),
    ELECTRONICS("ELECTRONICS", "Electronics", "💻"),
    BOOKS_NOTES("BOOKS_NOTES", "Books & Notes", "📚"),
    FASHION("FASHION", "Fashion", "👕"),
    HOSTEL_REQ("HOSTEL_REQ", "Hostel & Req", "🛏️"),
    HOBBY_SPORT("HOBBY_SPORT", "Hobby / Sport", "🏸"),
    OTHERS("OTHERS", "Others", "📦")
}
