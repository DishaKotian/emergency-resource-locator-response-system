const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emergencyRoutes = require('./routes/emergency');

const app = express();
app.use(express.json());
app.use(cors());

console.log('Emergency Service: Env MONGODB_URI found:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined. Using default connection string.');
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/emergency_db';
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Emergency Service: Connected to MongoDB'))
  .catch(err => console.error('Emergency Service: MongoDB connection error:', err));

app.use('/emergency', emergencyRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Emergency Service running on port ${PORT}`));
