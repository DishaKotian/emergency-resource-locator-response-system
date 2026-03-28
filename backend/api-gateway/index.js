const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001';
const EMERGENCY_URL = process.env.EMERGENCY_SERVICE_URL || 'http://127.0.0.1:5002';
const ADMIN_URL = process.env.ADMIN_SERVICE_URL || 'http://127.0.0.1:5003';

console.log('Gateway: AUTH  ->', AUTH_URL);
console.log('Gateway: EMERG ->', EMERGENCY_URL);
console.log('Gateway: ADMIN ->', ADMIN_URL);

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', auth: AUTH_URL, emergency: EMERGENCY_URL, admin: ADMIN_URL })
);

// ── Auth proxy ─────────────────────────────────────────────────────
// req.url inside app.use('/api/auth', ...) is already stripped of '/api/auth'
// e.g. POST /api/auth/register → req.url = /register → AUTH_URL/auth/register
app.use('/api/auth', async (req, res) => {
  const targetUrl = `${AUTH_URL}/auth${req.url}`;
  const headers = { 'Content-Type': 'application/json' };

  // Forward authorization header if present
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${targetUrl}`);
  try {
    const { data, status } = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers,
      validateStatus: () => true,
    });
    res.status(status).json(data);
  } catch (err) {
    console.error('[Gateway] Auth error:', err.message);
    res.status(502).json({ error: 'Auth service unavailable' });
  }
});

// ── Emergency proxy ────────────────────────────────────────────────
// e.g. GET /api/emergencies/list → req.url = /list → EMERGENCY_URL/emergency/list
app.use('/api/emergencies', async (req, res) => {
  const targetUrl = `${EMERGENCY_URL}/emergency${req.url}`;
  const headers = { 'Content-Type': 'application/json' };

  // Forward authorization header if present
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${targetUrl}`);
  try {
    const { data, status } = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers,
      validateStatus: () => true,
    });
    res.status(status).json(data);
  } catch (err) {
    console.error('[Gateway] Emergency error:', err.message);
    res.status(502).json({ error: 'Emergency service unavailable' });
  }
});

// ── Admin proxy ───────────────────────────────────────────────────
app.use('/api/admin', async (req, res) => {
  const targetUrl = `${ADMIN_URL}/admin${req.url}`;
  const headers = { 'Content-Type': 'application/json' };

  // Forward authorization header if present
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${targetUrl}`);
  try {
    const { data, status } = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers,
      validateStatus: () => true,
    });
    res.status(status).json(data);
  } catch (err) {
    console.error('[Gateway] Admin error:', err.message);
    res.status(502).json({ error: 'Admin service unavailable' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
