# ⚡ DTU Bazaar

> **Exclusive Campus Peer-to-Peer Marketplace for Delhi Technological University Students**

DTU Bazaar is a production-grade full-stack mobile and web marketplace engineered exclusively for the college student community of Delhi Technological University. Verified students (via college email OTP) can buy, sell, and exchange textbooks, electronics, cycles, coolers, and hostel essentials, chat in real-time with buyers and sellers, connect directly via WhatsApp, and receive seamless in-app Over-The-Air (OTA) APK updates from GitHub Releases.

---

## 🌟 Key Features

- **🎓 Verified Student Community**: Restricted to authenticated students via 4-digit numeric OTP sent directly to their email inbox.
- **⚡ Real-Time Socket.io Chat**: Instant messaging rooms, typing indicators, live notifications, and price offers with zero message duplication.
- **📲 Direct WhatsApp Integration**: 1-tap WhatsApp handshake via `url_launcher` with pre-filled listing inquiries.
- **📦 5 Campus Category Hubs**: Cycles, Electronics, Books & Academics, Hostel Essentials, Lab & Stationery, Sports & Fitness.
- **🖼️ Flexible Media Storage**: Multipart image upload pipeline via Multer with Cloudinary CDN integration and local disk fallback.
- **🛡️ Enterprise Security**: Hardened with Helmet HTTP headers, CORS policies, rate limiting (`express-rate-limit`), and JWT authentication.
- **🔄 In-App OTA Auto-Updater**: Directly checks GitHub Releases for new APK versions and presents an in-app download & install prompt without needing the Google Play Store.

---

## 🏗️ Architecture

```
Flutter Mobile App (Material 3, Provider, Dio, Socket.io client)
        │ HTTP REST            │ Persistent WebSocket
        ▼                      ▼
Express.js API Gateway (Helmet, Rate-Limiting, CORS, JWT, Multer)
        │
        ├── PostgreSQL (via Prisma ORM)
        ├── Cloudinary (image CDN, fallback to local disk storage)
        ├── Brevo SMTP / Nodemailer (4-digit OTP emails)
        └── Socket.io (chat rooms, typing indicators, live notifications)
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime & Language**: Node.js v20+, TypeScript (`tsx` for dev, `tsc` for build)
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL with Prisma ORM (`@prisma/client`, `prisma`)
- **Real-time**: Socket.io v4.8+
- **Security**: Helmet, CORS, Express-Rate-Limit, JSON Web Tokens (`jsonwebtoken`)
- **Uploads**: Multer + Cloudinary (with local disk fallback to `/uploads`)
- **Email / OTP**: Nodemailer (Brevo SMTP relay & Resend API)

### Mobile
- **Framework**: Flutter 3.x / Dart (Targeting Android 7.0+ and iOS)
- **Design System**: Material 3 with Plus Jakarta Sans (`google_fonts`)
- **State Management**: `provider` (^6.1.2) using `ChangeNotifier`
- **Networking**: `dio` (^5.4.3+1) with JWT Bearer interceptor & 45s timeouts
- **Real-Time Client**: `socket_io_client` (^2.0.3+1)
- **Local Storage**: `shared_preferences` (^2.2.3)
- **Media**: `image_picker` (^1.1.2), `cached_network_image` (^3.3.1)
- **Utilities**: `url_launcher` (^6.3.0), `intl` (^0.19.0), `http` (^1.2.1)

---

## 📁 Repository Structure

```
dtu-bazaar/
├── .github/workflows/build-flutter-apk.yml
├── server/
│   ├── src/
│   │   ├── config/{env.ts, prisma.ts}
│   │   ├── controllers/{auth.controller.ts, chat.controller.ts, listing.controller.ts, user.controller.ts}
│   │   ├── middleware/{auth.middleware.ts, rateLimit.middleware.ts, upload.middleware.ts}
│   │   ├── prisma/{schema.prisma, seed.ts}
│   │   ├── routes/{auth.routes.ts, chat.routes.ts, listing.routes.ts, user.routes.ts}
│   │   ├── services/{email.service.ts, otp.service.ts, socket.service.ts, storage.service.ts}
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── mobile/
    ├── lib/
    │   ├── core/
    │   │   ├── constants/{api_endpoints.dart, app_colors.dart, categories.dart}
    │   │   ├── network/{api_client.dart, socket_service.dart}
    │   │   ├── services/update_service.dart
    │   │   ├── theme/app_theme.dart
    │   │   └── utils/{formatters.dart, image_url_util.dart, url_launcher_util.dart}
    │   ├── data/{models/, repositories/}
    │   ├── state/{auth_provider.dart, listing_provider.dart, chat_provider.dart}
    │   ├── ui/
    │   │   ├── navigation/main_tab_screen.dart
    │   │   ├── screens/{auth/, chats/, home/, listing_detail/, profile/, sell/}
    │   │   └── widgets/
    │   └── main.dart
    └── pubspec.yaml
```

---

## 🚀 Run Instructions

### 1. Backend Server Setup

```bash
cd server
npm install
cp .env.example .env

# Configure DATABASE_URL and JWT_SECRET in server/.env
npm run db:push
npm run db:generate
npm run db:seed    # Seeds authentic DTU student profiles and campus listings

# Start dev server with hot-reload
npm run dev
```

Server will run at `http://localhost:5001`. You can test the health endpoint at `http://localhost:5001/api/health`.

### 2. Mobile App Setup

```bash
cd mobile

# Update lib/core/constants/api_endpoints.dart:
# - For Android Emulator: use http://10.0.2.2:5001
# - For Physical Android Device over Wi-Fi: use http://<your-lan-ip>:5001
# - For Production: use https://your-production-url.com

flutter pub get
flutter run
```

---

## 🔑 Environment Variables (`server/.env.example`)

```env
PORT=5001
NODE_ENV=production
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_random_key_min_32_characters_long
JWT_EXPIRES_IN=7d
ALLOWED_EMAIL_DOMAINS=dtu.ac.in,delhitechnologicaluniversity.edu,*
DATABASE_URL="postgresql://username:password@localhost:5432/dtubazaar?sslmode=disable"
OTP_EXPIRY_MINUTES=10
SIMULATE_EMAIL_OTP=false
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=dtu-bazaar/listings
UPLOAD_DIR=uploads
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_account_email
SMTP_PASS=your_brevo_smtp_key
EMAIL_FROM="DTU Bazaar <no-reply@dtu-bazaar.com>"
```

---

## 📡 REST API Catalog

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/request-otp` | Public | Enforces domain allowlist, generates 4-digit OTP, dispatches email |
| `POST` | `/api/auth/verify-otp` | Public | Validates OTP against DB record, issues 7-day JWT, returns user profile |
| `GET` | `/api/auth/me` | JWT | Returns current authenticated student profile and listing count |
| `GET` | `/api/listings` | Public | Paginated marketplace feed with category, condition, price, and text query filters |
| `GET` | `/api/listings/:id` | Public | Full listing details + seller campus contacts + increments view counter |
| `POST` | `/api/listings` | JWT | Multipart upload with `images` array (max 5) + listing metadata |
| `PATCH` | `/api/listings/:id/sold` | JWT | Marks item as SOLD and archives from the active marketplace feed |
| `GET` | `/api/chat/conversations` | JWT | Fetches user's conversations sorted by latest message activity |
| `POST` | `/api/chat/conversations` | JWT | Finds or creates 1-to-1 buyer-seller conversation thread for an item |
| `GET` | `/api/chat/conversations/:id/messages` | JWT | Returns message history and marks unread messages as read |
| `POST` | `/api/chat/conversations/:id/messages` | JWT | Creates message and broadcasts via Socket.io to room and receiver inbox |
| `GET` | `/api/users/my-listings` | JWT | Returns authenticated student's active and sold items |
| `POST` | `/api/users/saved/toggle` | JWT | Toggles bookmark / wishlist state for a listing |
| `GET` | `/api/health` | Public | Server health ping returning `{ status, version, otpDigits: 4, timestamp }` |

---

## 🎨 Mobile Design System

- **Primary Lime**: `#C6FF3D`
- **Emerald Primary**: `#10B981` | **Emerald Dark**: `#047857`
- **Background**: `#F8FAFC` | **Surface**: `#FFFFFF` | **Border**: `#E2E8F0`
- **Text Primary**: `#0F172A` | **Text Secondary**: `#64748B` | **Text Muted**: `#94A3B8`
- **WhatsApp Green**: `#25D366` | **Error Red**: `#EF4444`
- **Typography**: Plus Jakarta Sans (`google_fonts`)

---

## 🤖 GitHub Actions CI/CD Pipeline

The `.github/workflows/build-flutter-apk.yml` workflow automatically builds and publishes production APK releases on push of tags matching `v*.*.*`:

1. Checks out repository code.
2. Sets up Eclipse Temurin JDK 17.
3. Sets up Flutter on the stable release channel with caching.
4. Executes `flutter pub get` in `mobile/`.
5. Compiles universal APK via `flutter build apk --release --split-per-abi=false`.
6. Staged to `release-output/DTU-Bazaar.apk`.
7. Publishes GitHub Release using `softprops/action-gh-release@v2` with `contents: write`.

---

## 📄 License

MIT License. Designed and engineered for the Delhi Technological University student community.
