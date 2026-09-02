package com.nikhilrathor.portfolio.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.models.ListingCategory
import com.nikhilrathor.portfolio.data.models.User
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.ui.auth.AuthScreen
import com.nikhilrathor.portfolio.ui.auth.AuthViewModel
import com.nikhilrathor.portfolio.ui.chats.ChatConversationScreen
import com.nikhilrathor.portfolio.ui.chats.ChatsListScreen
import com.nikhilrathor.portfolio.ui.chats.ChatsViewModel
import com.nikhilrathor.portfolio.ui.components.CampusBottomNavBar
import com.nikhilrathor.portfolio.ui.components.CampusNavTab
import com.nikhilrathor.portfolio.ui.explore.ExploreScreen
import com.nikhilrathor.portfolio.ui.explore.ExploreViewModel
import com.nikhilrathor.portfolio.ui.home.HomeScreen
import com.nikhilrathor.portfolio.ui.home.HomeViewModel
import com.nikhilrathor.portfolio.ui.listing.ListingDetailScreen
import com.nikhilrathor.portfolio.ui.listing.ListingDetailViewModel
import com.nikhilrathor.portfolio.ui.onboarding.ProfileCreationViewModel
import com.nikhilrathor.portfolio.ui.onboarding.ProfileCreationWizardScreen
import com.nikhilrathor.portfolio.ui.profile.ProfileScreen
import com.nikhilrathor.portfolio.ui.profile.ProfileViewModel
import com.nikhilrathor.portfolio.ui.sell.SellViewModel
import com.nikhilrathor.portfolio.ui.sell.SellWizardScreen
import com.nikhilrathor.portfolio.ui.splash.SplashScreen
import com.nikhilrathor.portfolio.ui.splash.SplashViewModel

@Composable
fun RootNavGraph(
    navController: NavHostController = rememberNavController(),
    dataStore: DtuBazaarDataStore,
    repository: DtuBazaarRepository
) {
    val splashViewModel = remember { SplashViewModel(dataStore) }
    val authViewModel = remember { AuthViewModel(dataStore) }
    val profileCreationViewModel = remember { ProfileCreationViewModel(dataStore, repository) }
    val homeViewModel = remember { HomeViewModel(repository, dataStore) }
    val exploreViewModel = remember { ExploreViewModel(repository, dataStore) }
    val sellViewModel = remember { SellViewModel(repository) }
    val listingDetailViewModel = remember { ListingDetailViewModel(repository, dataStore) }
    val chatsViewModel = remember { ChatsViewModel(repository) }
    val profileViewModel = remember { ProfileViewModel(dataStore, repository) }

    val user by dataStore.userFlow.collectAsState(initial = null)
    val currentUser = user ?: User()

    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        // 1. Splash Screen
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateNext = { route ->
                    navController.navigate(route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                },
                viewModel = splashViewModel
            )
        }

        // 2. Auth Screen
        composable(Screen.Auth.route) {
            AuthScreen(
                onNavigateToProfileCreation = {
                    navController.navigate(Screen.Onboarding.route) {
                        popUpTo(Screen.Auth.route) { inclusive = true }
                    }
                },
                viewModel = authViewModel
            )
        }

        // 3. Profile Creation Wizard
        composable(Screen.Onboarding.route) {
            ProfileCreationWizardScreen(
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                },
                viewModel = profileCreationViewModel
            )
        }

        // 4. Main App Shell (5 Tabs)
        composable(Screen.Main.route) {
            MainCampusShell(
                onNavigateToListing = { listingId ->
                    navController.navigate(Screen.ListingDetail.createRoute(listingId))
                },
                onNavigateToChat = { convId ->
                    navController.navigate(Screen.ChatConversation.createRoute(convId))
                },
                onNavigateToAuth = {
                    navController.navigate(Screen.Auth.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                },
                onNavigateToSell = {
                    navController.navigate(Screen.Sell.route)
                },
                currentUser = currentUser,
                homeViewModel = homeViewModel,
                exploreViewModel = exploreViewModel,
                sellViewModel = sellViewModel,
                chatsViewModel = chatsViewModel,
                profileViewModel = profileViewModel
            )
        }

        // 5. Sell Wizard Screen
        composable(Screen.Sell.route) {
            SellWizardScreen(
                onNavigateBack = { navController.popBackStack() },
                onListingCreated = { newListingId ->
                    navController.navigate(Screen.ListingDetail.createRoute(newListingId)) {
                        popUpTo(Screen.Sell.route) { inclusive = true }
                    }
                },
                currentUser = currentUser,
                viewModel = sellViewModel
            )
        }

        // 6. Listing Detail Screen
        composable(
            route = Screen.ListingDetail.route,
            arguments = listOf(navArgument("listingId") { type = NavType.StringType })
        ) { backStackEntry ->
            val listingId = backStackEntry.arguments?.getString("listingId") ?: ""
            ListingDetailScreen(
                listingId = listingId,
                onNavigateBack = { navController.popBackStack() },
                onOpenChat = { convId ->
                    navController.navigate(Screen.ChatConversation.createRoute(convId))
                },
                onNavigateToListing = { newId ->
                    navController.navigate(Screen.ListingDetail.createRoute(newId))
                },
                onNavigateToCategory = { catId ->
                    exploreViewModel.onSelectCategory(
                        ListingCategory.values().find { it.id == catId } ?: ListingCategory.DRAWING_TOOLS
                    )
                    navController.popBackStack(Screen.Main.route, false)
                },
                viewModel = listingDetailViewModel
            )
        }

        // 7. Chat Conversation Screen
        composable(
            route = Screen.ChatConversation.route,
            arguments = listOf(navArgument("conversationId") { type = NavType.StringType })
        ) { backStackEntry ->
            val convId = backStackEntry.arguments?.getString("conversationId") ?: ""
            ChatConversationScreen(
                conversationId = convId,
                onNavigateBack = { navController.popBackStack() },
                viewModel = chatsViewModel
            )
        }
    }
}

@Composable
fun MainCampusShell(
    onNavigateToListing: (String) -> Unit,
    onNavigateToChat: (String) -> Unit,
    onNavigateToAuth: () -> Unit,
    onNavigateToSell: () -> Unit,
    currentUser: User,
    homeViewModel: HomeViewModel,
    exploreViewModel: ExploreViewModel,
    sellViewModel: SellViewModel,
    chatsViewModel: ChatsViewModel,
    profileViewModel: ProfileViewModel
) {
    var currentTab by remember { mutableStateOf(CampusNavTab.HOME) }

    Scaffold(
        bottomBar = {
            CampusBottomNavBar(
                currentRoute = currentTab.route,
                onTabSelected = { tab ->
                    if (tab == CampusNavTab.SELL) {
                        onNavigateToSell()
                    } else {
                        currentTab = tab
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(innerPadding)
        ) {
            when (currentTab) {
                CampusNavTab.HOME -> HomeScreen(
                    onNavigateToListing = onNavigateToListing,
                    onNavigateToCategory = { catId ->
                        exploreViewModel.onSelectCategory(
                            ListingCategory.values().find { cat -> cat.id == catId } ?: ListingCategory.DRAWING_TOOLS
                        )
                        currentTab = CampusNavTab.EXPLORE
                    },
                    onNavigateToExplore = { currentTab = CampusNavTab.EXPLORE },
                    onNavigateToSell = onNavigateToSell,
                    currentUser = currentUser,
                    viewModel = homeViewModel
                )
                CampusNavTab.EXPLORE -> ExploreScreen(
                    onNavigateToListing = onNavigateToListing,
                    viewModel = exploreViewModel
                )
                CampusNavTab.SELL -> {} // Handled via onNavigateToSell()
                CampusNavTab.CHATS -> ChatsListScreen(
                    onNavigateToChat = onNavigateToChat,
                    viewModel = chatsViewModel
                )
                CampusNavTab.PROFILE -> ProfileScreen(
                    onNavigateToListing = onNavigateToListing,
                    onNavigateToAuth = onNavigateToAuth,
                    currentUser = currentUser,
                    viewModel = profileViewModel
                )
            }
        }
    }
}
