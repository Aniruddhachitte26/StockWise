const express = require('express');
const axios = require('axios');

const router = express.Router();

// API key configuration
const API_KEY = 'd0023phr01qud9qlbgt0d0023phr01qud9qlbgtg'; // Replace with your actual API key
const BASE_URL = 'https://api.example.com/v1'; // Replace with actual API endpoint

// Middleware to verify API key
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

// Get stock information
router.get('/stock/:symbol', verifyApiKey, async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${BASE_URL}/stock/${symbol}`, {
            headers: { 'x-api-key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Get stock price history
router.get('/stock/:symbol/history', verifyApiKey, async (req, res) => {
    try {
        const { symbol } = req.params;
        const { from, to } = req.query;
        const response = await axios.get(`${BASE_URL}/stock/${symbol}/history`, {
            params: { from, to },
            headers: { 'x-api-key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock history' });
    }
});

// Search stocks
router.get('/search', verifyApiKey, async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { query },
            headers: { 'x-api-key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search stocks' });
    }
});

module.exports = router;