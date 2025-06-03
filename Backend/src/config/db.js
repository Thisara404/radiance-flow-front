const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the connection process
    console.log('Connecting to MongoDB...');
    console.log(`MONGO_URI defined: ${!!process.env.MONGO_URI}`);
    
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined. Please check your .env file.');
    }
    
    // Additional options for Mongoose 6+
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;