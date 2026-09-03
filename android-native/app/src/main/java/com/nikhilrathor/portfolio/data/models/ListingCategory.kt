package com.nikhilrathor.portfolio.data.models

enum class ListingCategory(
    val id: String,
    val title: String,
    val subtitle: String,
    val icon: String,
    val stripColorHex: Long,
    val imageUrl: String
) {
    DRAWING_TOOLS(
        "DRAWING_TOOLS",
        "Drawing Tools",
        "Calculators, drafters, scale sets & more",
        "📐",
        0xFFF97316,
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80"
    ),
    ELECTRONICS(
        "ELECTRONICS",
        "Electronics",
        "Laptops, keyboards, chargers & more",
        "💻",
        0xFF8B5CF6,
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
    ),
    BOOKS_NOTES(
        "BOOKS_NOTES",
        "Books & Notes",
        "Engineering math, syllabus books & notes",
        "📚",
        0xFF3B82F6,
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ),
    FASHION(
        "FASHION",
        "Fashion",
        "Lab coats, hoodies, sports gear & uniforms",
        "👕",
        0xFFEC4899,
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
    ),
    HOSTEL_REQ(
        "HOSTEL_REQ",
        "Hostel & Req",
        "Coolers, mattresses, kettles & bedsheets",
        "🛏️",
        0xFF10B981,
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ),
    HOBBY_SPORT(
        "HOBBY_SPORT",
        "Hobby / Sport",
        "Cycles, badminton racquets & gym gear",
        "🏸",
        0xFF14B8A6,
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80"
    ),
    OTHERS(
        "OTHERS",
        "Others",
        "Misc campus equipment, gadgets & more",
        "📦",
        0xFF6B7280,
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80"
    )
}
