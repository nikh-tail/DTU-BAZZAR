package com.nikhilrathor.portfolio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.nikhilrathor.portfolio.data.local.DtuBazaarDataStore
import com.nikhilrathor.portfolio.data.repository.DtuBazaarRepository
import com.nikhilrathor.portfolio.navigation.RootNavGraph
import com.nikhilrathor.portfolio.theme.AppThemeMode
import com.nikhilrathor.portfolio.theme.DtuBazaarTheme

class MainActivity : ComponentActivity() {

    private val dataStore by lazy { DtuBazaarDataStore(applicationContext) }
    private val repository by lazy { DtuBazaarRepository() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val themeMode by dataStore.themeModeFlow.collectAsState(initial = AppThemeMode.DARK)

            DtuBazaarTheme(themeMode = themeMode) {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.background),
                    color = MaterialTheme.colorScheme.background
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
