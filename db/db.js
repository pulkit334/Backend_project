const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.URI); 
    await mongoose.connect(process.env.URI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB