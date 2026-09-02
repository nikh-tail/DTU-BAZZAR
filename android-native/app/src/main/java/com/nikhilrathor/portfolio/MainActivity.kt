package com.nikhilrathor.portfolio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.navigation.RootNavGraph
import com.nikhilrathor.portfolio.theme.CyberBackground
import com.nikhilrathor.portfolio.theme.NikhilRathorPortfolioTheme

class MainActivity : ComponentActivity() {

    private val dataStore by lazy { DtuBazaarDataStore(applicationContext) }
    private val repository by lazy { DtuBazaarRepository() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            NikhilRathorPortfolioTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = CyberBackground
                ) {
                    RootNavGraph(
                        dataStore = dataStore,
                        repository = repository
                    )
                }
            }
        }
    }
}
