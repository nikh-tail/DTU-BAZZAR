# DTU Bazaar ⚡

> **Peer-to-Peer Campus Marketplace for Delhi Technological University (DTU)**
> Buy, sell, and trade textbooks, cycles, desert coolers, scientific calculators, lab drafters, and hostel essentials directly with verified DTU students.

---

## 🎨 Visual Identity & UX Direction

- **Dark High-Energy Theme**: Obsidian navy canvas (`#070B14`) with electric neon lime accents (`#C6FF3D`), cyber pink tags (`#E8397A`), and soft accent glow shadows.
- **SharePal Layout**: 4-across colorful bleeding category cards, large mixed-weight headlines, and 3-column **ZERO Scam / ZERO Delivery / ZERO Brokerage** trust statement blocks.
- **OLX Search Density**: Fast multi-facet sidebar filtering (Category, Price Slider, Condition, DTU Hostels, Sorting) and 4-column responsive product card grid (2-column mobile).
- **Direct Campus Messaging**: Real-time Socket.io in-app peer chat with 1-click campus inquiry chips ("Is this available?", "Meet at Mic-Mac Canteen?").

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti |
| **Backend API** | Node.js + Express + TypeScript |
| **Real-time Chat** | Socket.io (room-based buyer/seller messaging & typing notifications) |
| **Database & ORM** | PostgreSQL / SQLite + Prisma ORM |
| **Authentication** | DTU College Email Domain Validation (`@dtu.ac.in`) + 6-digit OTP Verification |
| **Image Storage** | Local Multer Storage with Static Serving (Pluggable S3 / Cloudinary adapter) |

---

## 📁 Modular Directory Layout (Teammate Hand-off Ready)

```
dtu-bazaar/
├── server/
│   ├── src/
│   │   ├── config/            # Environment configs, Prisma singleton & Socket.io setup
│   │   ├── controllers/       # Modular controllers (auth, listing, chat, user)
│   │   ├── middleware/        # JWT auth guard, Multer file upload & validation
│   │   ├── routes/            # REST API endpoints (/api/auth, /api/listings, /api/chat, /api/users)
│   │   ├── services/          # OTP engine, Socket broadcaster, Email sender & Storage adapter
│   │   ├── prisma/            # schema.prisma & realistic DTU campus seed script
│   │   └── server.ts          # Main Express + Socket.io server
│   ├── uploads/               # Uploaded item photos
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer, Badge, Button, Input, Modal, ImageUploader
│   │   │   ├── home/          # HeroSection, CategoryGrid, SubCategoryChips, Trending, TrustZero, Stats
│   │   │   ├── listings/      # ListingCard, ListingFilters, ListingGallery, QuickActionBox
│   │   │   ├── chat/          # ChatDrawer, ChatList, ChatWindow, QuickReplies
│   │   │   └── profile/       # ProfileCard, UserListingsTabs
│   │   ├── context/           # AuthContext, SocketContext, ChatContext
│   │   ├── pages/             # HomePage, BrowsePage, ListingDetailPage, CreateListingPage, ProfilePage
│   │   ├── services/          # Axios API service adapters
│   │   ├── types/             # Shared TypeScript models
│   │   └── utils/             # DTU constants (Hostels, Branches, Categories) & Formatters
│   ├── tailwind.config.js     # Custom neon lime & dark obsidian tokens
│   └── vite.config.ts         # Vite server with /api and /socket.io proxy
└── package.json               # Monorepo concurrent runner
```

---

## ⚡ Quick Start Guide (Run Locally)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone or navigate to the project directory:
```bash
cd /Users/nikhilrathor89/.gemini/antigravity/scratch/dtu-bazaar

# Install dependencies for root, server, and client:
npm run install:all
```

### 3. Database Setup & Realistic DTU Seed Data
The project uses Prisma ORM with SQLite out-of-the-box for zero-configuration local runs (can be switched to PostgreSQL with 1 line in `.env` and `schema.prisma`).

```bash
# Push schema and seed authentic DTU students & listings (Casio 991EX, Hero Cycle, Symphony Cooler, etc.):
npm run db:setup
```

### 4. Start Development Servers
Run both backend (`http://localhost:5000`) and frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database URL (SQLite out-of-the-box, or PostgreSQL)
DATABASE_URL="file:./dev.db"
# PostgreSQL example:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/dtu_bazaar?schema=public"

# JWT Authentication
JWT_SECRET="dtu_bazaar_jwt_super_secret_key_2026_campus_token"
JWT_EXPIRES_IN="7d"

# Campus Domain Validation
ALLOWED_EMAIL_DOMAINS="dtu.ac.in,student.dtu.ac.in,dtu.edu"
OTP_EXPIRY_MINUTES=10
SIMULATE_EMAIL_OTP=true

# Storage
UPLOAD_DIR="uploads"
MAX_FILE_SIZE_MB=5
```

---

## 🎓 DTU Campus Features Implemented

1. **Email OTP Authentication**: Strictly enforces `@dtu.ac.in` domains. During local development, the generated OTP is logged to the terminal and displayed directly in the UI helper badge for effortless testing.
2. **Campus Profile Onboarding**: Automatically captures DTU branch (CSE, ECE, ME, IT, etc.), study year (1st to 4th year), and hostel residence (Aryabhatta, VVS, JC Bose, Kalpana Chawla, Day Scholars).
3. **Item Listing & Multi-Photo Upload**: Supports up to 5 photos, price, condition (New / Like New / Good / Fair), and handover location inside DTU.
4. **Real-time Peer Chat**: In-app messenger powered by Socket.io with live unread notification badges and 1-click campus inquiry chips ("Meet at Mic-Mac Canteen?").
5. **Listing Management**: 1-click "Mark as Sold" to immediately archive items from active feeds and update campus deal track records.
6. **Wishlist Bookmarks**: Save listings to track prices and items across campus.
