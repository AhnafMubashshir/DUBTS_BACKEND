const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.URL}/${process.env.DB_NAME}`);
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;