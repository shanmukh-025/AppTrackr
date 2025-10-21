const prisma = require('./prisma/client');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Count users
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Test 2: Get first user
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    if (users.length > 0) {
      console.log('✅ Sample user:', users[0]);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
