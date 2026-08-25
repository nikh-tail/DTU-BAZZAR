import http from 'http';
import { app } from '../server.js';

async function runTests() {
  console.log('🧪 Starting DTU Bazaar Full-Stack API Integration Tests...\n');

  const server = http.createServer(app);
  const TEST_PORT = 5098;

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`📡 Test Server listening on http://127.0.0.1:${TEST_PORT}\n`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData: any = await healthRes.json();
    if (healthRes.status !== 200 || healthData.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(healthData)}`);
    }
    console.log('   ✅ Health check passed (Allowed domains: ' + healthData.allowedDomains.join(', ') + ')');

    // Test 2: Reject Non-DTU Email
    console.log('\n2️⃣ Testing Non-DTU Email Rejection...');
    const invalidEmailRes = await fetch(`${baseUrl}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'outsider@gmail.com' }),
    });
    const invalidEmailData: any = await invalidEmailRes.json();
    if (invalidEmailRes.status === 200 || invalidEmailData.success) {
      throw new Error('Should have rejected outsider@gmail.com');
    }
    console.log('   ✅ Correctly rejected outsider email: "' + invalidEmailData.message + '"');

    // Test 3: Accept DTU Email & Send OTP
    console.log('\n3️⃣ Testing DTU Student OTP Dispatch...');
    const testEmail = `student_${Date.now()}@dtu.ac.in`;
    const otpRes = await fetch(`${baseUrl}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    const otpData: any = await otpRes.json();
    if (!otpData.success || !otpData.debugOtp) {
      throw new Error(`OTP dispatch failed: ${JSON.stringify(otpData)}`);
    }
    console.log(`   ✅ OTP dispatched successfully to ${testEmail} (OTP: ${otpData.debugOtp})`);

    // Test 4: Verify OTP and Register Student
    console.log('\n4️⃣ Testing OTP Verification & Student Onboarding...');
    const verifyRes = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: otpData.debugOtp,
        name: 'Arjun Kapoor',
        branch: 'Software Engineering',
        year: '2nd Year',
        userType: 'HOSTELER',
        hostel: 'Aryabhatta Hostel',
      }),
    });
    const authData: any = await verifyRes.json();
    if (!authData.success || !authData.token) {
      throw new Error(`OTP verification failed: ${JSON.stringify(authData)}`);
    }
    const token = authData.token;
    console.log(`   ✅ Authenticated! JWT token issued for ${authData.user.name} (${authData.user.branch})`);

    // Test 5: Fetch Listings Feed
    console.log('\n5️⃣ Testing Listings Marketplace Feed...');
    const listingsRes = await fetch(`${baseUrl}/listings`);
    const listingsData: any = await listingsRes.json();
    if (!listingsData.success || listingsData.data.length === 0) {
      throw new Error(`Failed to fetch listings: ${JSON.stringify(listingsData)}`);
    }
    console.log(`   ✅ Fetched ${listingsData.data.length} active DTU campus listings (Total: ${listingsData.pagination.total})`);

    // Test 6: Search & Filter (Casio Calculator)
    console.log('\n6️⃣ Testing Search & Category Filtering...');
    const filterRes = await fetch(`${baseUrl}/listings?search=Casio&category=ELECTRONICS`);
    const filterData: any = await filterRes.json();
    if (!filterData.success || filterData.data.length === 0) {
      throw new Error(`Search filter failed: ${JSON.stringify(filterData)}`);
    }
    console.log(`   ✅ Found: "${filterData.data[0].title}" (₹${filterData.data[0].price})`);

    // Test 7: Create a New Listing
    console.log('\n7️⃣ Testing Create New Listing (Authenticated)...');
    const newListingRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Bicycle Cable Lock with 4-Digit Combination (Heavy Duty)',
        description: 'Hardened steel cable lock for cycle stand parking outside hostels. 1.2 meter length.',
        price: 350,
        category: 'CYCLES',
        condition: 'LIKE_NEW',
        campusLocation: 'Aryabhatta Hostel Cycle Stand',
      }),
    });
    const createdData: any = await newListingRes.json();
    if (!createdData.success || !createdData.data) {
      throw new Error(`Create listing failed: ${JSON.stringify(createdData)}`);
    }
    const createdListingId = createdData.data.id;
    console.log(`   ✅ Created listing: "${createdData.data.title}" (ID: ${createdListingId})`);

    // Test 8: Mark Listing as Sold
    console.log('\n8️⃣ Testing Mark Item as Sold...');
    const soldRes = await fetch(`${baseUrl}/listings/${createdListingId}/sold`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    const soldData: any = await soldRes.json();
    if (!soldData.success || soldData.data.status !== 'SOLD') {
      throw new Error(`Mark as sold failed: ${JSON.stringify(soldData)}`);
    }
    console.log(`   ✅ Listing successfully marked as "SOLD" and archived from active feed`);

    // Test 9: Initiate Chat
    console.log('\n9️⃣ Testing In-App Peer Chat...');
    const existingListing = listingsData.data[0];
    const chatRes = await fetch(`${baseUrl}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listingId: existingListing.id }),
    });
    const chatData: any = await chatRes.json();
    if (!chatData.success || !chatData.data) {
      throw new Error(`Chat creation failed: ${JSON.stringify(chatData)}`);
    }
    const convId = chatData.data.id;
    console.log(`   ✅ Created live conversation room with seller for "${existingListing.title}"`);

    // Test 10: Send Peer Message
    console.log('\n🔟 Testing Peer Message Dispatch...');
    const msgRes = await fetch(`${baseUrl}/chat/conversations/${convId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: 'Hey, can we meet outside Mic-Mac canteen after 4 PM classes?' }),
    });
    const msgData: any = await msgRes.json();
    if (!msgData.success || !msgData.data.text) {
      throw new Error(`Send message failed: ${JSON.stringify(msgData)}`);
    }
    console.log(`   ✅ Message saved & broadcasted: "${msgData.data.text}"`);

    console.log('\n🎉 ALL 10 INTEGRATION TESTS PASSED SUCCESSFULLY! ⚡\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
