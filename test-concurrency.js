const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function createSession(userId) {
  try {
    const response = await axios.post(`${BASE_URL}/sessions/create`, {
      userId: `concurrent-user-${userId}`,
      greetingUrl: 'https://demo.twilio.com/docs/classic.mp3',
      expiresInMinutes: 5
    });
    
    const { phoneNumber, sessionId } = response.data.data;
    console.log(`✅ User ${userId}: Got phone ${phoneNumber} (Session: ${sessionId})`);
    return { userId, phoneNumber, sessionId, success: true };
  } catch (error) {
    console.log(`❌ User ${userId}: ${error.response?.data?.message || error.message}`);
    return { userId, success: false, error: error.message };
  }
}

async function testConcurrency() {
  console.log('🚀 Testing concurrent session creation...\n');
  
  // Create 5 concurrent requests
  const promises = [];
  for (let i = 1; i <= 5; i++) {
    promises.push(createSession(i));
  }
  
  // Wait for all to complete
  const results = await Promise.all(promises);
  
  console.log('\n📊 Results:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📞 Phone numbers assigned:');
    successful.forEach(result => {
      console.log(`  User ${result.userId}: ${result.phoneNumber}`);
    });
    
    // Check for duplicates
    const phoneNumbers = successful.map(r => r.phoneNumber);
    const uniqueNumbers = [...new Set(phoneNumbers)];
    
    if (phoneNumbers.length === uniqueNumbers.length) {
      console.log('\n✅ SUCCESS: All users got unique phone numbers!');
    } else {
      console.log('\n❌ PROBLEM: Duplicate phone numbers detected!');
    }
  }
}

// Run the test
testConcurrency().catch(console.error);