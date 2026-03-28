const express = require('express');
const axios = require('axios');
const { authenticateToken, requireRole } = require('../../middleware/auth');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001';
const EMERGENCY_SERVICE_URL = process.env.EMERGENCY_SERVICE_URL || 'http://127.0.0.1:5002';

// Get all users (proxy call to Auth Service)
router.get('/users', authenticateToken, requireRole('admin'), async (req, res) => {
  console.log('[Admin] Fetching all users from:', `${AUTH_SERVICE_URL}/auth/all-users`);
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/all-users`);
    res.json(response.data);
  } catch (err) {
    console.error('[Admin] Error fetching users:', err.message);
    if (err.response) {
      console.error('[Admin] Auth Service responded with:', err.response.status, err.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch users', detail: err.message });
  }
});

// Get global stats (proxy call to Emergency Service)
router.get('/stats', authenticateToken, requireRole('admin'), async (req, res) => {
  console.log('[Admin] Fetching stats from:', `${EMERGENCY_SERVICE_URL}/emergency/stats`);
  try {
    const headers = {
      'Authorization': req.headers.authorization || undefined,
    };
    const response = await axios.get(`${EMERGENCY_SERVICE_URL}/emergency/stats`, { headers });
    res.json(response.data);
  } catch (err) {
    console.error('[Admin] Error fetching stats:', err.message);
    if (err.response) {
      console.error('[Admin] Emergency Service responded with:', err.response.status, err.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch stats', detail: err.message });
  }
});

module.exports = router;
