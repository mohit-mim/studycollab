const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined!');
            console.error('📋 Available environment variables:');
            console.error(Object.keys(process.env).filter(key => !key.includes('PATH')).join(', '));
            throw new Error('MONGODB_URI environment variable is required but not set');
        }

        console.log('🔗 Attempting to connect to MongoDB...');
        console.log(`📝 Connection string starts with: ${process.env.MONGODB_URI.substring(0, 20)}...`);

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
