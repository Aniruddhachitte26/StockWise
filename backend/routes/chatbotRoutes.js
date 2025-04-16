const express = require('express');
const router = express.Router();
const { summarizeWithLLM } = require('../controllers/chatbotController');

router.get('/chat', summarizeWithLLM);

module.exports = router;
