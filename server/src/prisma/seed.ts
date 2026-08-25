import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DTU Bazaar database seed with authentic campus listings...');

  // Clean existing records
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.savedListing.deleteMany({});
  await prisma.listingImage.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.otpVerification.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Verified DTU Student Users
  const rohan = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: '21co101@dtu.ac.in',
      branch: 'Computer Science & Engineering',
      year: '3rd Year',
      userType: 'HOSTELER',
      hostel: 'Aryabhatta Hostel',
      roomNumber: 'A-214',
      phone: '+91 98765 43210',
      rating: 4.9,
      reviewCount: 9,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Verma',
      email: '22ece045@dtu.ac.in',
      branch: 'Electronics & Communication',
      year: '2nd Year',
      userType: 'HOSTELER',
      hostel: 'Kalpana Chawla Hostel',
      roomNumber: 'KC-308',
      phone: '+91 98111 22334',
      rating: 5.0,
      reviewCount: 6,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    },
  });

  const aman = await prisma.user.create({
    data: {
      name: 'Aman Yadav',
      email: '20me089@dtu.ac.in',
      branch: 'Mechanical Engineering',
      year: '4th Year',
      userType: 'HOSTELER',
      hostel: 'Sir Visvesvaraya (VVS) Hostel',
      roomNumber: 'V-102',
      phone: '+91 97123 45678',
      rating: 4.8,
      reviewCount: 14,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  });

  const divya = await prisma.user.create({
    data: {
      name: 'Divya Gupta',
      email: '23mc012@dtu.ac.in',
      branch: 'Mathematics & Computing',
      year: '1st Year',
      userType: 'DAY_SCHOLAR',
      hostel: 'Day Scholar (Rohini Sector 16)',
      phone: '+91 98222 33445',
      rating: 5.0,
      reviewCount: 4,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    },
  });

  const harshit = await prisma.user.create({
    data: {
      name: 'Harshit Malhotra',
      email: '21ee056@dtu.ac.in',
      branch: 'Electrical Engineering',
      year: '3rd Year',
      userType: 'HOSTELER',
      hostel: 'Sir JC Bose Hostel',
      roomNumber: 'JC-419',
      phone: '+91 99555 66778',
      rating: 4.7,
      reviewCount: 7,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Authentic DTU Campus Listings
  const listingsData = [
    {
      title: 'Casio FX-991EX Classwiz Scientific Calculator (Original QR matrix)',
      description:
        'Original Casio Classwiz 991EX in pristine condition. Used during 1st & 2nd year Engineering Mathematics & Numerical Methods. High-resolution LCD, matrix 4x4 solver, equation calculation. All buttons work flawlessly. Solar panel and battery both working.',
      price: 790,
      category: 'ELECTRONICS',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Aryabhatta Hostel / Computer Center',
      viewsCount: 68,
      featured: true,
      sellerId: rohan.id,
      images: [
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Hero Sprint Pro 21-Speed Mountain Cycle (With Heavy Cable Lock)',
      description:
        'Well-maintained 21-speed Hero Sprint bike. Front disc brake, dual suspension, smooth Shimano gear shifting. Kept parked under covered shed near VVS Hostel. Selling as I am graduating this May. Comes with free heavy number lock and bell.',
      price: 3400,
      category: 'CYCLES',
      condition: 'GOOD',
      status: 'ACTIVE',
      campusLocation: 'VVS Hostel Cycle Stand',
      viewsCount: 142,
      featured: true,
      sellerId: aman.id,
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Symphony Desert Room Air Cooler (45L Honeycomb Pad)',
      description:
        'Lifesaver for DTU hostel summers! Powerful 45-litre capacity Symphony cooler with honeycomb cooling pads and ice chamber. Works great on hostel inverter backup. Cleaned and ready for immediate plug-and-play.',
      price: 2450,
      category: 'HOSTEL_ESSENTIALS',
      condition: 'GOOD',
      status: 'ACTIVE',
      campusLocation: 'Aryabhatta Hostel, 2nd Floor',
      viewsCount: 189,
      featured: true,
      sellerId: rohan.id,
      images: [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Dell 24" FHD IPS Gaming/Coding Monitor (75Hz, HDMI + DP)',
      description:
        'Dell 24-inch borderless IPS display. 99% sRGB color gamut, low blue light comfort view, height adjustable tilt stand. Perfect for coding, dual-screen laptop setup, and movies in the hostel room.',
      price: 6200,
      category: 'ELECTRONICS',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Sir JC Bose Hostel',
      viewsCount: 215,
      featured: true,
      sellerId: harshit.id,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1547082297-819692d518db?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Omega Engineering Mini Drafter + Drawing Board + Hard Sheet Tube',
      description:
        'Complete 1st year Engineering Graphics kit! Heavy duty Omega mini drafter with stainless steel rod, acrylic scale without chips, drafting board clips, and waterproof sheet carrier tube. Saved me during workshop evaluations.',
      price: 490,
      category: 'LAB_STATIONERY',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Kalpana Chawla Hostel / Mech Dept',
      viewsCount: 77,
      featured: false,
      sellerId: priya.id,
      images: [
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'CSE 3rd Sem Books Bundle (CLRS Algorithms + Morris Mano DLD + Notes)',
      description:
        'Standard curriculum textbooks: Cormen (Introduction to Algorithms 3rd Ed), Morris Mano (Digital Logic), plus handwritten topic-wise class notes for Mid-sem and End-sem exams. No highlighted marks.',
      price: 850,
      category: 'BOOKS_ACADEMICS',
      condition: 'GOOD',
      status: 'ACTIVE',
      campusLocation: 'Mic-Mac Canteen / Library Lawns',
      viewsCount: 94,
      featured: true,
      sellerId: divya.id,
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Sleepwell 4-inch High Resilience Hostel Single Bed Mattress',
      description:
        '4-inch single bed (72x36) Sleepwell orthopedic foam mattress. Super comfortable, fits standard DTU hostel cots exactly. Kept clean with mattress protector. No sagging.',
      price: 1100,
      category: 'HOSTEL_ESSENTIALS',
      condition: 'GOOD',
      status: 'ACTIVE',
      campusLocation: 'Sir Visvesvaraya (VVS) Hostel',
      viewsCount: 52,
      featured: false,
      sellerId: aman.id,
      images: [
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Yonex Muscle Power 29 Badminton Rackets Pair + Mavis 350 Shuttles',
      description:
        'Pair of original Yonex Muscle Power 29 (full graphite body, 24 lbs string tension) + half tube of Yonex Mavis 350 nylon shuttles. Great for playing at DTU Indoor Sports Complex.',
      price: 1650,
      category: 'SPORTS_FITNESS',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Sports Complex / Open Air Theatre (OAT)',
      viewsCount: 110,
      featured: false,
      sellerId: harshit.id,
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Keychron K2 V2 Wireless Mechanical Keyboard (Brown Switches, RGB)',
      description:
        '75% compact wireless mechanical keyboard. Mac & Windows layout keys included. Gateron brown tactile switches, type-C charging, Bluetooth 5.1 multi-device pairing. 2 months old with invoice.',
      price: 4500,
      category: 'ELECTRONICS',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Aryabhatta Hostel',
      viewsCount: 310,
      featured: true,
      sellerId: rohan.id,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'White Cotton Lab Coat (Size 40) + Anti-Fog Chemistry Safety Goggles',
      description:
        'Compulsory 100% thick white cotton lab coat for DTU Chemistry Lab & Engineering Workshop. 2 large side pockets. Includes safety goggles. Freshly laundered.',
      price: 260,
      category: 'LAB_STATIONERY',
      condition: 'GOOD',
      status: 'ACTIVE',
      campusLocation: 'Kalpana Chawla Hostel',
      viewsCount: 45,
      featured: false,
      sellerId: priya.id,
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Firefox Target 29T 21-Speed Hybrid Cycle (Orange / Black)',
      description:
        'Premium 29-inch Firefox alloy cycle. Front zoom suspension, broad tires for campus gravel paths, quick release front wheel. Serviced at Rithala cycle station recently.',
      price: 5500,
      category: 'CYCLES',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      campusLocation: 'Sir JC Bose Hostel Gate',
      viewsCount: 164,
      featured: true,
      sellerId: harshit.id,
      images: [
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80',
      ],
    },
  ];

  for (const item of listingsData) {
    const { images, ...listingPayload } = item;
    await prisma.listing.create({
      data: {
        ...listingPayload,
        images: {
          create: images.map((url, idx) => ({ url, order: idx })),
        },
      },
    });
  }

  // 3. Create Sample Real-Time Conversations
  const sampleListing = await prisma.listing.findFirst({
    where: { sellerId: rohan.id, category: 'ELECTRONICS' },
  });

  if (sampleListing) {
    const conv = await prisma.conversation.create({
      data: {
        listingId: sampleListing.id,
        buyerId: divya.id,
        sellerId: rohan.id,
        lastMessageText: 'Great, see you outside Amul stall at 4:30 PM!',
        lastMessageAt: new Date(),
        messages: {
          create: [
            {
              senderId: divya.id,
              text: 'Hey Rohan! Is the Casio Classwiz calculator still available?',
              isRead: true,
              createdAt: new Date(Date.now() - 15 * 60 * 1000),
            },
            {
              senderId: rohan.id,
              text: 'Yes Divya! In pristine condition, all 552 functions and matrix mode work.',
              isRead: true,
              createdAt: new Date(Date.now() - 10 * 60 * 1000),
            },
            {
              senderId: divya.id,
              text: 'Can we meet at Mic-Mac canteen today after 4 PM classes?',
              isRead: true,
              createdAt: new Date(Date.now() - 5 * 60 * 1000),
            },
            {
              senderId: rohan.id,
              text: 'Great, see you outside Amul stall at 4:30 PM!',
              isRead: false,
              createdAt: new Date(Date.now() - 1 * 60 * 1000),
            },
          ],
        },
      },
    });
    console.log(`💬 Seeded sample live chat between Divya and Rohan on listing: ${sampleListing.title}`);
  }

  console.log('✅ Seed finished successfully! 5 verified students and 11 authentic campus listings created.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
