require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notesdb",
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_key_123"
};
