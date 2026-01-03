require('dotenv').config();
const mongoose = require('mongoose');

// Test multiple connection string variations
const connectionStrings = [
    {
        name: 'With retryWrites and w=majority',
        uri: 'mongodb+srv://mohitmohanbarick24_db_user:mohit96192@cluster0.9xqzknx.mongodb.net/studycollab?retryWrites=true&w=majority&appName=Cluster0'
    },
    {
        name: 'Minimal (just appName)',
        uri: 'mongodb+srv://mohitmohanbarick24_db_user:mohit96192@cluster0.9xqzknx.mongodb.net/studycollab?appName=Cluster0'
    },
    {
        name: 'Without database name',
        uri: 'mongodb+srv://mohitmohanbarick24_db_user:mohit96192@cluster0.9xqzknx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    }
];

async function testConnection(config) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${config.name}`);
    console.log('='.repeat(60));

    try {
        const conn = await mongoose.connect(config.uri, {
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ SUCCESS!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);

        await mongoose.disconnect();
        return true;
    } catch (error) {
        console.log('❌ FAILED');
        console.log('Error Code:', error.code);
        console.log('Error Message:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('MongoDB Atlas Connection String Tests');
    console.log('Testing different connection string formats...\n');

    for (const config of connectionStrings) {
        const success = await testConnection(config);
        if (success) {
            console.log('\n🎉 Found working configuration!');
            console.log('Use this connection string in your .env file:');
            console.log(config.uri);
            process.exit(0);
        }

        // Wait a bit between attempts
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n❌ All connection attempts failed.');
    console.log('\nPlease verify in MongoDB Atlas:');
    console.log('1. Database Access → User "mohitmohanbarick24_db_user" exists');
    console.log('2. Password is exactly: mohit96192');
    console.log('3. Network Access → 0.0.0.0/0 is whitelisted and ACTIVE');
    console.log('4. Wait 2-3 minutes after making any changes');

    process.exit(1);
}

runTests();
