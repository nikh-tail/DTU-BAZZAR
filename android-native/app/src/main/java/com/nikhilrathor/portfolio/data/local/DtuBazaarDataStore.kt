package com.nikhilrathor.portfolio.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.nikhilrathor.portfolio.data.models.User
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

val Context.dtuBazaarDataStore: DataStore<Preferences> by preferencesDataStore(name = "dtu_bazaar_prefs")

class DtuBazaarDataStore(private val context: Context) {

    private object Keys {
        val IS_LOGGED_IN = booleanPreferencesKey("is_logged_in")
        val IS_ONBOARDED = booleanPreferencesKey("is_onboarded")
        val USER_ID = stringPreferencesKey("user_id")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_EMAIL = stringPreferencesKey("user_email")
        val USER_BRANCH = stringPreferencesKey("user_branch")
        val USER_YEAR = stringPreferencesKey("user_year")
        val USER_IS_HOSTELER = booleanPreferencesKey("user_is_hosteler")
        val USER_HOSTEL = stringPreferencesKey("user_hostel")
        val USER_AVATAR = stringPreferencesKey("user_avatar")
        val SAVED_LISTINGS = stringSetPreferencesKey("saved_listings")
        val THEME_MODE = stringPreferencesKey("theme_mode")
    }

    val themeModeFlow: Flow<com.nikhilrathor.portfolio.theme.AppThemeMode> = context.dtuBazaarDataStore.data
        .catch { emit(emptyPreferences()) }
        .map { prefs ->
            val modeStr = prefs[Keys.THEME_MODE] ?: com.nikhilrathor.portfolio.theme.AppThemeMode.DARK.name
            try {
                com.nikhilrathor.portfolio.theme.AppThemeMode.valueOf(modeStr)
            } catch (e: Exception) {
                com.nikhilrathor.portfolio.theme.AppThemeMode.DARK
            }
        }

    val userFlow: Flow<User?> = context.dtuBazaarDataStore.data
        .catch { exception ->
            if (exception is IOException) emit(emptyPreferences()) else throw exception
        }
        .map { prefs ->
            val isLoggedIn = prefs[Keys.IS_LOGGED_IN] ?: false
            if (!isLoggedIn) return@map null

            User(
                id = prefs[Keys.USER_ID] ?: "user_dtu",
                name = prefs[Keys.USER_NAME] ?: "DTU Student",
                email = prefs[Keys.USER_EMAIL] ?: "student@dtu.ac.in",
                avatarEmoji = prefs[Keys.USER_AVATAR] ?: "⚡",
                branch = prefs[Keys.USER_BRANCH] ?: "Computer Science",
                year = prefs[Keys.USER_YEAR] ?: "3rd Year",
                isHosteler = prefs[Keys.USER_IS_HOSTELER] ?: true,
                hostelName = prefs[Keys.USER_HOSTEL] ?: "Aryabhatta Hostel",
                isVerified = true,
                isOnboarded = prefs[Keys.IS_ONBOARDED] ?: false
            )
        }

    val savedListingsFlow: Flow<Set<String>> = context.dtuBazaarDataStore.data
        .catch { emit(emptyPreferences()) }
        .map { prefs -> prefs[Keys.SAVED_LISTINGS] ?: emptySet() }

    suspend fun setThemeMode(mode: com.nikhilrathor.portfolio.theme.AppThemeMode) {
        context.dtuBazaarDataStore.edit { prefs ->
            prefs[Keys.THEME_MODE] = mode.name
        }
    }

    suspend fun saveAuthSession(email: String) {
        context.dtuBazaarDataStore.edit { prefs ->
            prefs[Keys.IS_LOGGED_IN] = true
            prefs[Keys.USER_EMAIL] = email
            prefs[Keys.USER_ID] = "user_${email.substringBefore("@")}"
        }
    }

    suspend fun saveUserProfile(
        name: String,
        branch: String,
        year: String,
        isHosteler: Boolean,
        hostelName: String,
        avatarEmoji: String
    ) {
        context.dtuBazaarDataStore.edit { prefs ->
            prefs[Keys.USER_NAME] = name
            prefs[Keys.USER_BRANCH] = branch
            prefs[Keys.USER_YEAR] = year
            prefs[Keys.USER_IS_HOSTELER] = isHosteler
            prefs[Keys.USER_HOSTEL] = hostelName
            prefs[Keys.USER_AVATAR] = avatarEmoji
            prefs[Keys.IS_ONBOARDED] = true
        }
    }

    suspend fun toggleSavedListing(listingId: String) {
        context.dtuBazaarDataStore.edit { prefs ->
            val current = (prefs[Keys.SAVED_LISTINGS] ?: emptySet()).toMutableSet()
            if (current.contains(listingId)) {
                current.remove(listingId)
            } else {
                current.add(listingId)
            }
            prefs[Keys.SAVED_LISTINGS] = current
        }
    }

    suspend fun logout() {
        context.dtuBazaarDataStore.edit { prefs ->
            val theme = prefs[Keys.THEME_MODE] ?: com.nikhilrathor.portfolio.theme.AppThemeMode.DARK.name
            prefs.clear()
            prefs[Keys.THEME_MODE] = theme
        }
    }
}
