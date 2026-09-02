package com.nikhilrathor.portfolio.data.models

data class User(
    val id: String = "user_dtu_1",
    val name: String = "Nikhil Rathor",
    val email: String = "nikhilrathor_2k22@dtu.ac.in",
    val avatarUrl: String = "",
    val avatarEmoji: String = "⚡",
    val branch: String = "Computer Science & Engineering",
    val year: String = "4th Year",
    val isHosteler: Boolean = true,
    val hostelName: String = "Sir JC Bose Hostel",
    val isVerified: Boolean = true,
    val rating: Double = 4.9,
    val totalDeals: Int = 18,
    val joinedDate: String = "Joined Aug 2022",
    val isOnboarded: Boolean = false
)
