const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

console.log('Auth Service: Env MONGODB_URI found:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/auth_db';
}

if (!process.env.JWT_SECRET) {
  console.error('Auth Service: JWT_SECRET is required and missing. Set it in your environment.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Auth Service: Connected to MongoDB'))
  .catch(err => console.error('Auth Service: MongoDB connection error:', err));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
