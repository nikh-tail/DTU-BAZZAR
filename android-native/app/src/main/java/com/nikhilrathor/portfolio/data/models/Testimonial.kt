package com.nikhilrathor.portfolio.data.models

data class Testimonial(
    val id: String,
    val studentName: String,
    val branch: String,
    val hostel: String,
    val quote: String,
    val rating: Int = 5,
    val avatarEmoji: String = "🎓"
)

data class CampusStat(
    val title: String,
    val value: String,
    val subtext: String,
    val icon: String
)
