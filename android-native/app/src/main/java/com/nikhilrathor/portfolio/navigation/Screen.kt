package com.nikhilrathor.portfolio.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Auth : Screen("auth")
    object Onboarding : Screen("onboarding")
    object Main : Screen("main")
    object Sell : Screen("sell")
    object ListingDetail : Screen("listing_detail/{listingId}") {
        fun createRoute(listingId: String) = "listing_detail/$listingId"
    }
    object ChatConversation : Screen("chat_conversation/{conversationId}") {
        fun createRoute(conversationId: String) = "chat_conversation/$conversationId"
    }
}
