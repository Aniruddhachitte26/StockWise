const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbotController');

router.post('/chat', getChatbotResponse);

module.exports = router;
