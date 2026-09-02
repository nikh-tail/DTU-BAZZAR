package com.nikhilrathor.portfolio.data.repository

import com.nikhilrathor.portfolio.data.models.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class DtuBazaarRepository {

    val campusLocations = listOf(
        "Mic-Mac Canteen",
        "OAT (Open Air Theatre)",
        "Central Library Lawn",
        "MechC Canteen",
        "Sir JC Bose Hostel Gate",
        "Aryabhatta Hostel Gate",
        "Sports Complex & Gym",
        "Admin Block Fountain"
    )

    val dtuBranches = listOf(
        "Computer Science (CSE)",
        "Information Technology (IT)",
        "Software Engineering (SE)",
        "Electronics & Comm (ECE)",
        "Electrical Engg (EE)",
        "Mechanical Engg (ME)",
        "Civil Engg (CE)",
        "Mathematics & Computing (MnC)",
        "Design (B.Des)",
        "Bio-Technology (BT)"
    )

    val dtuHostels = listOf(
        "Sir JC Bose Hostel (BH-2)",
        "Aryabhatta Hostel (BH-1)",
        "Varahamihira Hostel (BH-3)",
        "Sir CV Raman Hostel (BH-4)",
        "Homi Bhabha Hostel (BH-5)",
        "VVS Hostel (BH-6)",
        "Sister Nivedita Hostel (GH-1)",
        "Kalpana Chawla Hostel (GH-2)"
    )

    private val _listings = MutableStateFlow<List<Listing>>(getSeedListings())
    val listings: StateFlow<List<Listing>> = _listings

    private val _conversations = MutableStateFlow<List<Conversation>>(getSeedConversations())
    val conversations: StateFlow<List<Conversation>> = _conversations

    fun getStats(): List<CampusStat> = listOf(
        CampusStat("₹ Saved", "₹4.8L+", "Direct student deals", "💰"),
        CampusStat("Verified Students", "1,420+", "@dtu.ac.in authenticated", "🛡️"),
        CampusStat("Items Exchanged", "980+", "Zero commission", "📦"),
        CampusStat("Campus Rating", "4.9★", "From 620+ reviews", "⭐")
    )

    fun getTestimonials(): List<Testimonial> = listOf(
        Testimonial(
            id = "t1",
            studentName = "Arnav Sharma",
            branch = "CSE, 3rd Year",
            hostel = "Aryabhatta Hostel",
            quote = "Sold my 2nd-year drafter & Casio calculator within 20 minutes at Mic-Mac Canteen. No haggling with outside shopkeepers!",
            rating = 5,
            avatarEmoji = "🚀"
        ),
        Testimonial(
            id = "t2",
            studentName = "Rhea Kapoor",
            branch = "ECE, 2nd Year",
            hostel = "Kalpana Chawla Hostel",
            quote = "Found a Symphony room cooler right before the summer semester started. Transferred payment on UPI and picked it up in 10 mins.",
            rating = 5,
            avatarEmoji = "⭐"
        ),
        Testimonial(
            id = "t3",
            studentName = "Dhruv Malhotra",
            branch = "ME, 4th Year",
            hostel = "Sir JC Bose Hostel",
            quote = "Every graduating senior should list their hostel gear here. 100% verified campus students, zero spam.",
            rating = 5,
            avatarEmoji = "🎓"
        )
    )

    fun addListing(listing: Listing) {
        _listings.value = listOf(listing) + _listings.value
    }

    fun getListingById(id: String): Listing? {
        return _listings.value.find { it.id == id }
    }

    fun sendMessage(conversationId: String, text: String): ChatMessage {
        val message = ChatMessage(
            senderId = "me",
            text = text,
            timestamp = "Just now",
            isFromMe = true
        )
        _conversations.value = _conversations.value.map { conv ->
            if (conv.id == conversationId) {
                conv.copy(
                    lastMessage = text,
                    lastMessageTime = "Just now",
                    messages = conv.messages + message
                )
            } else conv
        }
        return message
    }

    private fun getSeedListings(): List<Listing> {
        val seller1 = User(
            id = "seller_1",
            name = "Rohan Verma",
            email = "rohan_2k23@dtu.ac.in",
            branch = "Computer Science",
            year = "3rd Year",
            isHosteler = true,
            hostelName = "Sir JC Bose Hostel",
            isVerified = true,
            rating = 4.9,
            totalDeals = 12,
            avatarEmoji = "💻"
        )

        val seller2 = User(
            id = "seller_2",
            name = "Priya Gupta",
            email = "priya_2k24@dtu.ac.in",
            branch = "Mechanical Engineering",
            year = "2nd Year",
            isHosteler = false,
            hostelName = "Day Scholar",
            isVerified = true,
            rating = 5.0,
            totalDeals = 8,
            avatarEmoji = "🎨"
        )

        val seller3 = User(
            id = "seller_3",
            name = "Aman Joshi",
            email = "aman_2k22@dtu.ac.in",
            branch = "Electrical Engineering",
            year = "4th Year",
            isHosteler = true,
            hostelName = "Aryabhatta Hostel",
            isVerified = true,
            rating = 4.8,
            totalDeals = 22,
            avatarEmoji = "⚡"
        )

        return listOf(
            Listing(
                id = "calc-casio-991",
                title = "Casio fx-991CW ClassWiz Scientific Calculator",
                description = "Barely used for 1 semester in Engineering Mathematics & Physics. Original box, cover, and fresh battery included. Essential for semester exams and lab evaluations.",
                price = 790,
                originalPrice = 1450,
                category = ListingCategory.DRAWING_TOOLS,
                condition = ItemCondition.LIKE_NEW,
                imageUrls = listOf("https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Mic-Mac Canteen or Sir JC Bose Gate",
                seller = seller1,
                viewsCount = 284,
                createdAt = "10 mins ago",
                tags = listOf("Casio", "Calculator", "Maths", "First Year")
            ),
            Listing(
                id = "drafter-omega-kit",
                title = "Omega Mini Drafter + Engineering Drawing Kit & Tube",
                description = "Complete Engineering Graphics bundle: Mini Drafter with sturdy clamp, drawing sheet holder tube, set squares (45 & 60 deg), French curves, and 0.5mm clutch pencil.",
                price = 380,
                originalPrice = 850,
                category = ListingCategory.DRAWING_TOOLS,
                condition = ItemCondition.GOOD,
                imageUrls = listOf("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Central Library Lawn",
                seller = seller2,
                viewsCount = 195,
                createdAt = "1 hour ago",
                tags = listOf("Drafter", "ED Kit", "Graphics", "First Year")
            ),
            Listing(
                id = "hostel-symphony-cooler",
                title = "Symphony 35L Desert Cooler for Hostel Rooms",
                description = "Powerful honeycomb pad cooling with 3-speed blower. High air throw, ultra-quiet, fits perfectly into Sir JC Bose & Aryabhatta window brackets. Cleaned and descaled.",
                price = 2400,
                originalPrice = 6200,
                category = ListingCategory.HOSTEL_REQ,
                condition = ItemCondition.GOOD,
                imageUrls = listOf("https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Sir JC Bose Hostel (BH-2)",
                seller = seller1,
                viewsCount = 430,
                createdAt = "3 hours ago",
                tags = listOf("Hostel", "Cooler", "Symphony", "Summer")
            ),
            Listing(
                id = "keychron-k2-keyboard",
                title = "Keychron K2 Wireless Mechanical Keyboard (Gateron Brown)",
                description = "Wireless Bluetooth 5.1 & Type-C wired mechanical keyboard. Mac & Windows layout keycaps included. Tactile quiet brown switches, ideal for hostel coding without disturbing roommates.",
                price = 4500,
                originalPrice = 7999,
                category = ListingCategory.ELECTRONICS,
                condition = ItemCondition.LIKE_NEW,
                imageUrls = listOf("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "OAT (Open Air Theatre)",
                seller = seller3,
                viewsCount = 340,
                createdAt = "5 hours ago",
                tags = listOf("Mechanical Keyboard", "Coding", "Keychron")
            ),
            Listing(
                id = "clrs-algorithms-book",
                title = "Introduction to Algorithms (CLRS 4th Edition - Hardcover)",
                description = "The gold standard for algorithms & technical placement prep. Pristine condition with zero pen markings or highlights. Complete chapters on dynamic programming, graph theory, and NP-completeness.",
                price = 850,
                originalPrice = 2100,
                category = ListingCategory.BOOKS_NOTES,
                condition = ItemCondition.LIKE_NEW,
                imageUrls = listOf("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Central Library Lawn",
                seller = seller1,
                viewsCount = 512,
                createdAt = "Yesterday",
                tags = listOf("CLRS", "Algorithms", "CSE", "Placement")
            ),
            Listing(
                id = "badminton-yonex-racket",
                title = "Yonex Carbonex 8000 + 3 Mavis 350 Shuttles",
                description = "Full graphite lightweight racket strung at 24 lbs with BG65 titanium string. Grip replaced recently. Perfect for late night matches at the DTU Sports Complex.",
                price = 1100,
                originalPrice = 2400,
                category = ListingCategory.HOBBY_SPORT,
                condition = ItemCondition.GOOD,
                imageUrls = listOf("https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Sports Complex & Gym",
                seller = seller3,
                viewsCount = 180,
                createdAt = "2 days ago",
                tags = listOf("Badminton", "Yonex", "Sports")
            ),
            Listing(
                id = "dtu-fest-hoodie",
                title = "DTU Yuvaan Fest Official Black Hoodie (Size L)",
                description = "Premium fleece oversized DTU hoodie. Worn only twice, warm inside lining with kangaroo pocket.",
                price = 450,
                originalPrice = 1100,
                category = ListingCategory.FASHION,
                condition = ItemCondition.LIKE_NEW,
                imageUrls = listOf("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"),
                pickupLocation = "Mic-Mac Canteen",
                seller = seller2,
                viewsCount = 210,
                createdAt = "3 days ago",
                tags = listOf("Hoodie", "DTU", "Fest", "Fashion")
            )
        )
    }

    private fun getSeedConversations(): List<Conversation> {
        val partner1 = User(
            id = "partner_1",
            name = "Rohan Verma",
            email = "rohan_2k23@dtu.ac.in",
            branch = "CSE 3rd Year",
            year = "3rd Year",
            hostelName = "Sir JC Bose",
            avatarEmoji = "💻"
        )
        val partner2 = User(
            id = "partner_2",
            name = "Priya Gupta",
            email = "priya_2k24@dtu.ac.in",
            branch = "ME 2nd Year",
            year = "2nd Year",
            hostelName = "Day Scholar",
            avatarEmoji = "🎨"
        )

        return listOf(
            Conversation(
                id = "conv_1",
                partner = partner1,
                listingTitle = "Casio fx-991CW Calculator",
                listingPrice = 790,
                listingImageUrl = "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80",
                lastMessage = "Let's meet at Mic-Mac Canteen at 4:30 PM!",
                lastMessageTime = "12:45 PM",
                unreadCount = 1,
                messages = listOf(
                    ChatMessage("m1", partner1.id, "Hey! Is the Casio 991CW calculator still available?", "12:30 PM", false),
                    ChatMessage("m2", "me", "Yes, in perfect condition with box!", "12:35 PM", true),
                    ChatMessage("m3", partner1.id, "Can you do ₹750? I can pick it up today.", "12:40 PM", false),
                    ChatMessage("m4", "me", "Sure, ₹750 works. Let's meet in campus.", "12:42 PM", true),
                    ChatMessage("m5", partner1.id, "Let's meet at Mic-Mac Canteen at 4:30 PM!", "12:45 PM", false)
                )
            ),
            Conversation(
                id = "conv_2",
                partner = partner2,
                listingTitle = "Omega Mini Drafter + ED Kit",
                listingPrice = 380,
                listingImageUrl = "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80",
                lastMessage = "Thanks for holding it for me, see you tomorrow.",
                lastMessageTime = "Yesterday",
                unreadCount = 0,
                messages = listOf(
                    ChatMessage("m6", partner2.id, "Hi! Does the kit include the sheet holder tube?", "Yesterday", false),
                    ChatMessage("m7", "me", "Yes, complete with black waterproof sheet tube.", "Yesterday", true),
                    ChatMessage("m8", partner2.id, "Thanks for holding it for me, see you tomorrow.", "Yesterday", false)
                )
            )
        )
    }
}
