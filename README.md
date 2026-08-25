<div align="center">

# ⚡ DTU Bazaar

### Peer-to-Peer Campus Marketplace for Delhi Technological University

[![Live Website](https://img.shields.io/badge/Live_Website-dtu--bazzar.vercel.app-00dfa2?style=for-the-badge&logo=vercel&logoColor=white)](https://dtu-bazzar.vercel.app)
[![API Status](https://img.shields.io/badge/Backend_API-Live_on_Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://dtu-bazzar.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>DTU Bazaar</strong> is a modern, high-performance marketplace platform engineered specifically for the <strong>Delhi Technological University (DTU)</strong> student ecosystem. It combines the high-energy aesthetic of SharePal with the search density of OLX, enabling students to buy, sell, and exchange academic textbooks, electronics, cycles, coolers, and hostel essentials directly with verified campus peers.
</p>

[Explore Live Demo](https://dtu-bazzar.vercel.app) • [API Documentation](#-api-endpoints) • [System Architecture](#-system-architecture) • [Getting Started](#-local-development)

---

</div>

## 🌟 Key Highlights

- **🎓 Verified Student Community**: Authenticated signup and login with 6-digit one-time verification codes (OTP) delivered directly to student inboxes via **Resend API**.
- **⚡ Real-Time In-App Messaging**: Instant peer-to-peer chat powered by **Socket.io** with live unread badge updates and 1-click campus inquiry chips (*"Can we meet at Mic-Mac Canteen?"*, *"Is price negotiable?"*).
- **🔎 High-Density Search & Filtering**: Multi-facet querying by Category, Price Range, Condition (*Brand New, Like New, Good, Fair*), and specific DTU Hostels (*Aryabhatta, VVS, JC Bose, Kalpana Chawla, Day Scholars*).
- **📦 1-Click Inventory Management**: Quick **"Mark as Sold"** actions to automatically archive items from active feeds, plus saved wishlist bookmarks.
- **🛡️ Enterprise Security**: Hardened with **Helmet HTTP security headers**, tiered IP rate-limiting (`express-rate-limit`), anti-brute-force OTP guards, and input sanitization via Zod.
- **☁️ Cloud Native Architecture**: Powered by **Neon Managed Cloud PostgreSQL**, **Cloudinary CDN** for media delivery, and serverless edge deployment on **Vercel** & **Render**.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["🖥️ Frontend (Vercel)"]
        UI["React 18 + TypeScript + Tailwind CSS"]
        State["Auth, Chat & Socket Context"]
        Proxy["Vercel Edge Proxy (/api rewrites)"]
        UI --> State
        State --> Proxy
    end

    subgraph BackendLayer["⚙️ Backend API (Render)"]
        Express["Express.js REST Engine"]
        Socket["Socket.io WebSocket Gateway"]
        Security["Helmet + Rate Limiters"]
        Prisma["Prisma ORM Client"]
        Express --> Security
        Security --> Prisma
        Express <--> Socket
    end

    subgraph CloudServices["☁️ Managed Cloud Infrastructure"]
        Neon[("Neon PostgreSQL Cloud Database")]
        Resend["Resend Transactional Email API"]
        Cloudinary["Cloudinary CDN Image Storage"]
    end

    Proxy -->|"HTTPS REST Calls"| Express
    State <-->|"WSS Real-Time Events"| Socket
    Prisma <-->|"Pooled SQL Connections"| Neon
    Express -->|"Send 6-Digit OTP"| Resend
    Express -->|"Upload Listing Media"| Cloudinary
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | High-performance SPA with SharePal dark aesthetic |
| **Icons & UI** | Lucide React, Canvas Confetti | Modern iconography and celebratory animations |
| **Backend** | Node.js, Express 5, TypeScript | Scalable REST API server |
| **Real-time Engine** | Socket.io 4.8 | Room-based instant messaging & presence |
| **Database & ORM** | Neon PostgreSQL, Prisma ORM 6 | Type-safe queries, connection pooling & migrations |
| **Email Infrastructure** | Resend API | Transactional OTP delivery to student inboxes |
| **Cloud Storage** | Cloudinary CDN | Asset optimization & global image distribution |
| **Security** | Helmet, Express Rate Limit, Zod | Defense-in-depth protection and payload validation |
| **Deployment** | Vercel (Frontend), Render (Backend) | Zero-downtime global cloud hosting |

---

## 📁 Repository Structure

```
dtu-bazaar/
├── client/                     # Frontend React SPA
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── common/         # Navbar, Footer, Badge, Button, Input, Modal
│   │   │   ├── home/           # Hero, CategoryGrid, TrustZero, CampusStats
│   │   │   ├── listings/       # ListingCard, ListingFilters, ListingGallery
│   │   │   ├── chat/           # ChatDrawer, ChatList, ChatWindow
│   │   │   └── profile/        # ProfileCard, UserListingsTabs
│   │   ├── context/            # Global Auth, Socket & Chat state providers
│   │   ├── pages/              # Routed pages (Home, Browse, Detail, Create, Profile)
│   │   ├── services/           # Axios HTTP client with JWT interceptors
│   │   └── types/              # TypeScript domain contracts
│   ├── tailwind.config.js      # Custom theme tokens & neon glow accents
│   └── vercel.json             # Vercel reverse proxy & SPA routing rules
├── server/                     # Backend API & WebSocket Server
│   ├── src/
│   │   ├── config/             # Environment, Prisma & Socket singletons
│   │   ├── controllers/        # Auth, Listing, Chat, and User business logic
│   │   ├── middleware/         # JWT verification, upload handling & rate limiters
│   │   ├── routes/             # Express API route declarations
│   │   ├── services/           # Email, OTP, Socket, and Storage adapters
│   │   └── prisma/             # Schema definitions & DTU sample seed script
│   ├── prisma/schema.prisma    # PostgreSQL database schema
│   └── .env.example            # Environment variables blueprint
├── render.yaml                 # Render cloud deployment blueprint
└── package.json                # Monorepo runner scripts
```

---

## ⚡ Local Development

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Clone and Install
```bash
git clone https://github.com/nikh-tail/DTU-BAZZAR.git
cd DTU-BAZZAR

# Install root, backend, and frontend dependencies:
npm run install:all
```

### 3. Configure Environment Variables
Create `server/.env` with your credentials (or copy from `server/.env.example`):
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (Neon PostgreSQL or local SQLite)
DATABASE_URL="postgresql://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require"

# JWT Secret
JWT_SECRET="your_jwt_secret_key"

# Email Delivery (Resend API)
RESEND_API_KEY="re_your_api_key"
SIMULATE_EMAIL_OTP=false
ALLOWED_EMAIL_DOMAINS="*"

# Media Storage (Cloudinary)
STORAGE_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 4. Database Setup & Seed
```bash
# Push schema and seed authentic DTU campus items:
npm run db:setup
```

### 5. Start Development Servers
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api/health`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/request-otp` — Request a 6-digit OTP code (rate-limited)
- `POST /api/auth/verify-otp` — Verify OTP and receive JWT session token
- `GET /api/auth/me` — Retrieve active user session profile

### Listings
- `GET /api/listings` — Query marketplace feed with multi-facet filters & search
- `GET /api/listings/:id` — Get detailed listing information with seller profile
- `POST /api/listings` — Create a new listing (Auth required, up to 5 photos)
- `PATCH /api/listings/:id/sold` — Mark an item as Sold (Archives from active feed)
- `DELETE /api/listings/:id` — Delete a listing (Owner only)

### Real-Time Chat
- `GET /api/chat/conversations` — Retrieve all active user chat threads
- `POST /api/chat/conversations` — Initiate a chat thread on a specific listing
- `GET /api/chat/conversations/:id/messages` — Fetch message history
- `POST /api/chat/conversations/:id/messages` — Send a message (Real-time Socket broadcast)

---

## 📜 Campus Community Honor Code
DTU Bazaar is dedicated exclusively to facilitating peer-to-peer campus exchanges. Transactions are conducted in-person within campus premises upon physical inspection. The platform charges 0% commission and does not process payments or retain financial data.

---

<div align="center">
  <sub>Built with ⚡ for the Delhi Technological University Community</sub>
</div>
