const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to MongoDB');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;