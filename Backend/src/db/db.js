const mongoose = require('mongoose');
const config = require('../config/env');

async function connectDB() {
  if (!config.mongoUrl) {
    throw new Error('MONGO_URL is not configured in Backend/.env');
  }
  await mongoose.connect(config.mongoUrl);
  console.log('connect to db');
}

module.exports = connectDB;
