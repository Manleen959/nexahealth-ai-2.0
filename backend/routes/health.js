const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const HealthLog = require('../models/HealthLog');

const protect = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

router.use(protect);

router.get('/history', async (req, res) => {
    try {
        const logs = await HealthLog.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// For dummy data charts
router.get('/progress', async (req, res) => {
    try {
        const logs = await HealthLog.find({ userId: req.user._id }).sort({ createdAt: 1 });
        // Simulating data points over time
        const data = logs.map(log => ({
            date: log.createdAt.toISOString().split('T')[0],
            counts: log.type === 'symptom' ? log.data.symptoms.length : 1
        }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

module.exports = router;
