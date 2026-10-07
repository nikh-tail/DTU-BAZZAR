# 🏛️ DTU Bazaar — Full-Stack Clone & Architecture Guide

A complete, production-grade guide to cloning and building **DTU Bazaar** from scratch. DTU Bazaar is an exclusive campus peer-to-peer marketplace designed for college students, featuring 4-digit college email OTP verification, real-time Socket.io chat, multi-image product listings, WhatsApp direct connect, and an In-App OTA Auto-Updater.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository Directory Structure](#3-repository-directory-structure)
4. [Database Schema (Prisma / PostgreSQL)](#4-database-schema-prisma--postgresql)
5. [Environment Variables (.env.example)](#5-environment-variables-envexample)
6. [Backend Architecture & Implementation](#6-backend-architecture--implementation)
   - [Express Server & Security](#express-server--security)
   - [Real-Time WebSocket Engine](#real-time-websocket-engine)
   - [4-Digit OTP Authentication](#4-digit-otp-authentication)
   - [Multer Multi-Image Uploads](#multer-multi-image-uploads)
   - [Complete REST API Catalog](#complete-rest-api-catalog)
7. [Mobile App Architecture (Flutter)](#7-mobile-app-architecture-flutter)
   - [Dependencies (pubspec.yaml)](#dependencies-pubspecyaml)
   - [Design System & Theme](#design-system--theme)
   - [Network Layer (Dio + Interceptors)](#network-layer-dio--interceptors)
   - [State Management (Provider)](#state-management-provider)
   - [Real-Time Chat & Deduplication](#real-time-chat--deduplication)
   - [In-App OTA Auto-Updater](#in-app-ota-auto-updater)
8. [CI/CD & Release Automation](#8-cicd--release-automation)
9. [Step-by-Step Build & Run Instructions](#9-step-by-step-build--run-instructions)
10. [Critical Pitfalls & Pro-Tips](#10-critical-pitfalls--pro-tips)

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Flutter Mobile App                   │
│   (Material 3, Provider State, Dio HTTP, Socket.io)    │
└──────────────┬──────────────────────────┬──────────────┘
               │ HTTP REST APIs           │ Persistent WebSockets
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                 Express.js API Gateway                 │
│  (Helmet, Rate-Limiting, CORS, JWT Auth, Multer)       │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
        ┌──────┴──────┐            ┌──────┴──────┐
        ▼             ▼            ▼             ▼
   PostgreSQL     Cloudinary     Brevo SMTP   Socket.io
   (via Prisma)   (Media CDN)    (4-Dig OTP)  (Rooms)
```

---

## 2. Technology Stack

### Backend Engine
- **Runtime**: Node.js v20+ with TypeScript (`tsx` for dev, `tsc` for production build)
- **Framework**: Express.js
- **Database**: PostgreSQL (or Supabase / Neon / AWS RDS)
- **ORM**: Prisma ORM (`@prisma/client`, `prisma`)
- **Real-Time**: Socket.io v4.8+
- **Security**: Helmet, CORS, `express-rate-limit`, JWT (`jsonwebtoken`)
- **Media Uploads**: Multer + Cloudinary (or local disk storage fallback)
- **Email / OTP**: Nodemailer (Brevo SMTP or Resend API)

### Mobile Client
- **Framework**: Flutter 3.x / Dart (Targeting Android 7.0+ & iOS)
- **State Management**: Provider (`ChangeNotifier`)
- **Networking**: Dio 5.x (with JWT Interceptor and timeout resilience)
- **WebSockets**: `socket_io_client`
- **Local Storage**: `shared_preferences`
- **Images**: `image_picker`, `cached_network_image`
- **Typography & UI**: `google_fonts` (Plus Jakarta Sans), `cupertino_icons`
- **Utilities**: `url_launcher` (WhatsApp & phone intent), `intl`

---

## 3. Repository Directory Structure

```
dtu-bazaar/
├── .github/
│   └── workflows/
│       └── build-flutter-apk.yml     # Auto-compiles release APK & creates GitHub Release
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                # Strongly typed environment configuration
│   │   │   └── prisma.ts             # Global PrismaClient singleton
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # 4-Digit OTP generation & verification
│   │   │   ├── chat.controller.ts    # Conversation & message endpoints
│   │   │   ├── listing.controller.ts # CRUD & search filters for listings
│   │   │   └── user.controller.ts    # Profile, saved items, seller stats
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT token validator
│   │   │   ├── rateLimit.middleware.ts # DDoS & anti-spam rate limiters
│   │   │   └── upload.middleware.ts  # Multer multipart storage
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Relational database schema
│   │   │   └── seed.ts               # Sample mock listings & student profiles
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── listing.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/
│   │   │   ├── email.service.ts      # HTML email template & SMTP transport
│   │   │   ├── otp.service.ts        # 4-digit code generator & expiry manager
│   │   │   ├── socket.service.ts     # Socket.io room and event manager
│   │   │   └── storage.service.ts    # Cloudinary / local storage abstraction
│   │   └── server.ts                 # Main server entrypoint
│   ├── package.json
│   └── tsconfig.json
└── mobile/
    ├── lib/
    │   ├── core/
    │   │   ├── constants/
    │   │   │   ├── api_endpoints.dart  # API routes & URLs
    │   │   │   ├── app_colors.dart     # Lime/Emerald design system
    │   │   │   └── categories.dart     # Categories with high-res campus imagery
    │   │   ├── network/
    │   │   │   ├── api_client.dart     # Dio client with JWT interceptor
    │   │   │   └── socket_service.dart # Socket.io event listeners
    │   │   ├── services/
    │   │   │   └── update_service.dart # In-app OTA GitHub release checker
    │   │   ├── theme/
    │   │   │   └── app_theme.dart      # Material 3 typography & themes
    │   │   └── utils/
    │   │       ├── formatters.dart     # Currency (₹), relative time
    │   │       ├── image_url_util.dart # Absolute URL resolver
    │   │       └── url_launcher_util.dart # WhatsApp & dialer trigger
    │   ├── data/
    │   │   ├── models/                 # UserModel, ListingModel, ConversationModel
    │   │   └── repositories/           # AuthRepository, ListingRepository, ChatRepository
    │   ├── state/
    │   │   ├── auth_provider.dart      # Login session, token storage
    │   │   ├── listing_provider.dart   # Feed, search, category filter state
    │   │   └── chat_provider.dart      # Messages, deduplication, active chats
    │   ├── ui/
    │   │   ├── navigation/
    │   │   │   └── main_tab_screen.dart # 5-Tab Scaffold (Home, Explore, Sell, Chats, Profile)
    │   │   ├── screens/
    │   │   │   ├── auth/               # DTU Email entry & 4-digit OTP
    │   │   │   ├── chats/              # Conversation list & real-time chat window
    │   │   │   ├── home/               # Marketplace feed & category chips
    │   │   │   ├── listing_detail/     # Carousel, WhatsApp button, Make Offer modal
    │   │   │   ├── profile/            # My listings, saved items, OTA updates
    │   │   │   └── sell/               # Multi-image sell wizard
    │   │   └── widgets/                # CampusListingCard, MakeOfferModal, etc.
    │   └── main.dart                   # Flutter App Entry
    └── pubspec.yaml
```

---

## 4. Database Schema (Prisma / PostgreSQL)

Create `server/src/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                    String         @id @default(cuid())
  email                 String         @unique
  name                  String
  isVerified            Boolean        @default(true)
  avatar                String?
  branch                String?
  year                  String?
  userType              String         @default("HOSTELER") // HOSTELER | DAY_SCHOLAR
  hostel                String?
  roomNumber            String?
  phone                 String?
  rating                Float          @default(5.0)
  reviewCount           Int            @default(1)
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt

  listings              Listing[]      @relation("UserListings")
  conversationsAsBuyer  Conversation[] @relation("BuyerConversations")
  conversationsAsSeller Conversation[] @relation("SellerConversations")
  messagesSent          Message[]      @relation("UserMessages")
  savedListings         SavedListing[]
}

model OtpVerification {
  id        String   @id @default(cuid())
  email     String
  otp       String
  expiresAt DateTime
  attempts  Int      @default(0)
  createdAt DateTime @default(now())

  @@index([email])
}

model Listing {
  id             String         @id @default(cuid())
  title          String
  description    String
  price          Float
  category       String         // CYCLES, ELECTRONICS, BOOKS_ACADEMICS, HOSTEL_ESSENTIALS, LAB_STATIONERY, SPORTS_FITNESS, OTHER
  condition      String         // NEW, LIKE_NEW, GOOD, FAIR
  status         String         @default("ACTIVE") // ACTIVE, SOLD, RESERVED, ARCHIVED
  campusLocation String?
  viewsCount     Int            @default(0)
  featured       Boolean        @default(false)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  sellerId       String
  seller         User           @relation("UserListings", fields: [sellerId], references: [id], onDelete: Cascade)
  
  images         ListingImage[]
  conversations  Conversation[]
  savedBy        SavedListing[]

  @@index([category])
  @@index([status])
  @@index([sellerId])
}

model ListingImage {
  id        String   @id @default(cuid())
  url       String
  order     Int      @default(0)
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([listingId])
}

model Conversation {
  id              String    @id @default(cuid())
  listingId       String
  listing         Listing   @relation(fields: [listingId], references: [id], onDelete: Cascade)
  
  buyerId         String
  buyer           User      @relation("BuyerConversations", fields: [buyerId], references: [id], onDelete: Cascade)
  
  sellerId        String
  seller          User      @relation("SellerConversations", fields: [sellerId], references: [id], onDelete: Cascade)
  
  lastMessageText String?
  lastMessageAt   DateTime? @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  messages        Message[]

  @@unique([listingId, buyerId])
  @@index([buyerId])
  @@index([sellerId])
  @@index([listingId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  senderId       String
  sender         User         @relation("UserMessages", fields: [senderId], references: [id], onDelete: Cascade)
  
  text           String
  isRead         Boolean      @default(false)
  createdAt      DateTime     @default(now())

  @@index([conversationId])
  @@index([senderId])
}

model SavedListing {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())

  @@unique([userId, listingId])
  @@index([userId])
}
```

---

## 5. Environment Variables (.env.example)

Create `server/.env`:

```env
PORT=5001
NODE_ENV=production
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_random_key_min_32_characters_long
JWT_EXPIRES_IN=7d

# Allowed student email domains (comma separated, use '*' for open testing)
ALLOWED_EMAIL_DOMAINS=dtu.ac.in,delhitechnologicaluniversity.edu,*

# PostgreSQL Database (Supabase / Neon / Local)
DATABASE_URL="postgresql://username:password@localhost:5432/dtubazaar?sslmode=disable"

# OTP Configuration
OTP_EXPIRY_MINUTES=10
SIMULATE_EMAIL_OTP=false

# Media Uploads (Cloudinary or local disk)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=dtu-bazaar/listings
UPLOAD_DIR=uploads

# Email Dispatcher (Brevo SMTP or Resend)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_account_email
SMTP_PASS=your_brevo_smtp_key
EMAIL_FROM="DTU Bazaar <no-reply@dtu-bazaar.com>"
```

---

## 6. Backend Architecture & Implementation

### Express Server & Security (`server/src/server.ts`)
```typescript
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config/env.js';
import { SocketService } from './services/socket.service.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';

export const app = express();
app.set('trust proxy', 1);
export const httpServer = http.createServer(app);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use('/api', globalLimiter);
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads fallback
app.use('/uploads', express.static(path.resolve(process.cwd(), config.uploadDir)));

// Socket.io initialization
export const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
SocketService.init(io);

// Health Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    version: '2.6.0',
    otpDigits: 4,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

httpServer.listen(config.port, () => {
  console.log(`🚀 DTU Bazaar Server running on port ${config.port}`);
});
```

### Real-Time WebSocket Engine (`server/src/services/socket.service.ts`)
```typescript
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export class SocketService {
  private static io: SocketIOServer | null = null;

  public static init(io: SocketIOServer) {
    this.io = io;

    io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
          (socket as any).userId = decoded.userId;
        } catch (_) {}
      }
      next();
    });

    io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;
      if (userId) {
        socket.join(`user:${userId}`);
      }

      socket.on('join_conversation', (conversationId: string) => {
        if (conversationId) socket.join(`conv:${conversationId}`);
      });

      socket.on('leave_conversation', (conversationId: string) => {
        if (conversationId) socket.leave(`conv:${conversationId}`);
      });

      socket.on('typing_start', ({ conversationId }) => {
        if (conversationId && userId) {
          socket.to(`conv:${conversationId}`).emit('user_typing', { conversationId, userId });
        }
      });

      socket.on('typing_stop', ({ conversationId }) => {
        if (conversationId && userId) {
          socket.to(`conv:${conversationId}`).emit('user_stopped_typing', { conversationId, userId });
        }
      });
    });
  }

  public static emitNewMessage(conversationId: string, receiverId: string, message: any) {
    if (!this.io) return;
    this.io.to(`conv:${conversationId}`).emit('new_message', { conversationId, message });
    this.io.to(`user:${receiverId}`).emit('new_message_notification', { conversationId, message });
  }
}
```

### 4-Digit OTP Authentication
- **Generation**: Strict 4 digits: `Math.floor(1000 + Math.random() * 9000).toString()`.
- **Validation**: Strict equality check with database record + expiration check (`expiresAt > now`).
- **Development Bypass**: Allows universal code `1234` only when explicitly configured for test environments.

### Complete REST API Catalog
| Method | Endpoint | Protection | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/request-otp` | Public (Rate-limited) | Checks domain, generates 4-digit OTP, sends email |
| `POST` | `/api/auth/verify-otp` | Public (Rate-limited) | Verifies OTP, signs JWT token, returns user profile |
| `GET` | `/api/auth/me` | Bearer JWT | Returns current authenticated user profile |
| `GET` | `/api/listings` | Public | Paginated feed, category filtering, search query |
| `GET` | `/api/listings/:id` | Public | Full listing details + seller contact + increments views |
| `POST` | `/api/listings` | Bearer JWT | Multipart upload with `images` files & metadata |
| `PATCH`| `/api/listings/:id/sold` | Bearer JWT | Marks item as SOLD |
| `GET` | `/api/chat/conversations` | Bearer JWT | Lists all user conversations with latest message |
| `POST` | `/api/chat/conversations` | Bearer JWT | Creates or finds existing buyer-seller conversation |
| `GET` | `/api/chat/conversations/:id/messages` | Bearer JWT | Message history pagination |
| `POST` | `/api/chat/conversations/:id/messages` | Bearer JWT | Sends message, broadcasts via Socket.io |
| `GET` | `/api/users/my-listings` | Bearer JWT | Returns authenticated user's active/sold listings |
| `POST` | `/api/users/saved/toggle` | Bearer JWT | Bookmarks or unbookmarks a listing |

---

## 7. Mobile App Architecture (Flutter)

### Dependencies (`mobile/pubspec.yaml`)
```yaml
name: dtu_bazaar
description: "DTU Bazaar — Exclusive Campus Peer Marketplace"
version: 2.6.0+7

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  dio: ^5.4.3+1
  http: ^1.2.1
  socket_io_client: ^2.0.3+1
  shared_preferences: ^2.2.3
  image_picker: ^1.1.2
  cached_network_image: ^3.3.1
  url_launcher: ^6.3.0
  intl: ^0.19.0
  google_fonts: ^6.2.1
  cupertino_icons: ^1.0.8

flutter:
  uses-material-design: true
```

### Design System & Theme (`mobile/lib/core/constants/app_colors.dart`)
```dart
import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors
  static const Color primaryLime = Color(0xFFC6FF3D);
  static const Color emeraldPrimary = Color(0xFF10B981);
  static const Color emeraldDark = Color(0xFF047857);

  // Surface & Background
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);

  // Typography
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);

  // Utilities & Socials
  static const Color whatsapp = Color(0xFF25D366);
  static const Color error = Color(0xFFEF4444);
}
```

### Network Layer (Dio + Interceptors) (`mobile/lib/core/network/api_client.dart`)
```dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_endpoints.dart';

class ApiClient {
  late final Dio dio;

  ApiClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 45),
        receiveTimeout: const Duration(seconds: 45),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Attach JWT Authorization Interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('auth_token');
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
      ),
    );
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) =>
      dio.get(path, queryParameters: queryParameters);

  Future<Response> post(String path, {dynamic data}) =>
      dio.post(path, data: data);
}
```

### Real-Time Chat & Deduplication (`mobile/lib/state/chat_provider.dart`)
To eliminate duplicate message bubbles caused by race conditions between HTTP responses and incoming socket broadcasts:

```dart
void addMessageSafely(MessageModel msg) {
  final exists = _messages.any((m) =>
      m.id == msg.id ||
      (m.senderId == msg.senderId &&
       m.content == msg.content &&
       msg.createdAt.difference(m.createdAt).inSeconds.abs() < 5));

  if (!exists) {
    _messages.add(msg);
    notifyListeners();
  }
}
```

### In-App OTA Auto-Updater (`mobile/lib/core/services/update_service.dart`)
Queries GitHub Releases API without requiring external app stores:

```dart
class UpdateService {
  static const String currentVersion = '2.6.0';
  static const String releasesUrl =
      'https://api.github.com/repos/<owner>/<repo>/releases/latest';

  static Future<ReleaseInfo?> checkForUpdate() async {
    final response = await http.get(
      Uri.parse(releasesUrl),
      headers: {'Accept': 'application/vnd.github.v3+json'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final tagName = (data['tag_name'] as String? ?? '').replaceFirst('v', '');
      
      if (_isNewerVersion(tagName, currentVersion)) {
        final assets = data['assets'] as List? ?? [];
        String downloadUrl = assets.firstWhere(
          (a) => (a['name'] as String).endsWith('.apk'),
          orElse: () => {'browser_download_url': ''},
        )['browser_download_url'];

        return ReleaseInfo(
          tagName: tagName,
          title: data['name'] ?? '',
          body: data['body'] ?? '',
          downloadUrl: downloadUrl,
        );
      }
    }
    return null;
  }
}
```

---

## 8. CI/CD & Release Automation

Create `.github/workflows/build-flutter-apk.yml`:

```yaml
name: Build & Release Flutter APK

on:
  push:
    tags:
      - 'v*.*.*'

permissions:
  contents: write

jobs:
  build:
    name: Build Release APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get
        working-directory: mobile

      - name: Build Android APK
        run: flutter build apk --release --split-per-abi=false
        working-directory: mobile

      - name: Prepare Release Artifact
        run: |
          mkdir -p release-output
          cp mobile/build/app/outputs/flutter-apk/app-release.apk release-output/DTU-Bazaar.apk

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: release-output/DTU-Bazaar.apk
          name: DTU Bazaar Mobile ${{ github.ref_name }}
          draft: false
          prerelease: false
```

---

## 9. Step-by-Step Build & Run Instructions

### 1. Set Up Database & Server
```bash
# 1. Clone your repo
git clone https://github.com/<owner>/dtu-bazaar.git && cd dtu-bazaar

# 2. Setup server
cd server
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Push schema to database
npm run db:push
npm run db:generate

# 4. Start backend in watch mode
npm run dev
```

### 2. Set Up & Run Flutter Mobile App
```bash
# 1. Enter mobile directory
cd ../mobile

# 2. Update server URL in lib/core/constants/api_endpoints.dart
# For Android Emulator: http://10.0.2.2:5001
# For Physical Phone: http://<YOUR_LOCAL_IP>:5001 or deployed backend URL

# 3. Install packages & run
flutter pub get
flutter run
```

---

## 10. Critical Pitfalls & Pro-Tips

1. **Multer Multi-part Fields**: When creating a listing with images, Flutter must use `dio.FormData.fromMap` and attach photos as `MultipartFile.fromFile` under field `'images'` matching `uploadImages.array('images', 5)`.
2. **WebSocket Rooms**: When navigating out of `chat_window_screen.dart`, always emit `leave_conversation` to prevent background messages from triggering false unread read-receipts.
3. **Android Cleartext Traffic**: If testing over local HTTP (e.g. `http://192.168.1.x:5001`), add `android:usesCleartextTraffic="true"` inside `mobile/android/app/src/main/AndroidManifest.xml`.
4. **Free Cloud Hosting (Render/AWS)**: Render free tier puts containers to sleep after 15 minutes. The Flutter `ApiClient` includes a warm-up ping (`/api/health`) to initiate container wake-up on app open.
