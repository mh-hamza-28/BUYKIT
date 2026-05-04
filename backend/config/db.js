const mongoose = require('mongoose');
const env = require('./env');

module.exports = async function connectDB() {
  try {
    const uri = env.mongoUri;
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI is missing');
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
