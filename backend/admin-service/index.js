const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());
app.use(cors());

console.log('Admin Service: Env MONGODB_URI found:', !!process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admin_db')
  .then(() => console.log('Admin Service: Connected to MongoDB'))
  .catch(err => console.error('Admin Service: MongoDB connection error:', err));

app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));
