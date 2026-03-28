const express = require('express');
const EmergencyRequest = require('../models/EmergencyRequest');
const { authenticateToken, requireRole } = require('../../middleware/auth');
const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { type, location, description } = req.body;

    // Validation
    if (!type || !location) {
      return res.status(400).json({ error: 'Type and location are required fields' });
    }

    const request = new EmergencyRequest({ type, location, description });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ timestamp: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/update/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await EmergencyRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const total = await EmergencyRequest.countDocuments();
    const pending = await EmergencyRequest.countDocuments({ status: 'pending' });
    const inProgress = await EmergencyRequest.countDocuments({ status: 'in-progress' });
    const completed = await EmergencyRequest.countDocuments({ status: 'completed' });
    res.json({ total, pending, inProgress, completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
