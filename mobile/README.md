# DTU Bazaar — Flutter Mobile App (Android & iOS)

Official cross-platform mobile app for **DTU Bazaar**, the peer-to-peer campus marketplace designed exclusively for Delhi Technological University students.

---

## 📱 Features

- **SharePal-Style Campus Category Grid**: 2-column interactive grid with touch background-color reveal and 8px solid colored accent strips.
- **Explore & Filter Marketplace**: Search by title, department, condition, and price range.
- **Listing Details & Specs**: Multi-photo gallery, fullscreen pinch-to-zoom Lightbox, collapsible specifications, and horizontal recommendations carousel.
- **Direct 1-Tap Communication**:
  - In-App Real-time Chat via WebSocket (`socket_io_client`).
  - 1-Tap **WhatsApp Direct Chat** with auto-filled message template.
  - Interactive **Make a Price Offer** modal with 5%/10%/15% bargain buttons.
- **Sell on Campus Wizard**: Multi-image selector (Camera & Gallery), branch/hostel tagging, and 3-listing cap Paywall alert (₹10 UPI QR).
- **Verified Student Profiles**: Active, Sold, and Saved Wishlist tabs with deal track record and Pro Seller upgrades.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) (version 3.0.0 or higher)
- Android Studio / Xcode (for iOS builds)
- Node.js backend server running on port `5001`

### 2. Run the App
```bash
cd mobile
flutter pub get
flutter run
```

### 3. Build APK for Android
```bash
cd mobile
flutter build apk --release
```
The generated APK will be available at `build/app/outputs/flutter-apk/app-release.apk`.
