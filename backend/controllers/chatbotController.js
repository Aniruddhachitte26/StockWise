const axios = require('axios');
const yahooFinance = require('yahoo-finance2').default;
const dotenv = require("dotenv");
dotenv.config();

const sessions = new Map();

const isStockRelated = (text) => {
    return /stock|share|price|market|nasdaq|portfolio|equity|finance|AAPL|MSFT|ticker|chart/i.test(text);
};

const formatHistoricalData = (data, symbol, shortName, exchange) => {
  return data.map(entry => {
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    const changePercent = (((entry.close - entry.open) / entry.open) * 100).toFixed(2);
    return `Symbol: ${symbol} (${shortName}) closed at $${entry.close.toFixed(2)} (${changePercent}%) on ${exchange} at ${dateStr}.`;
  }).join('\n');
};

async function callOpenRouter(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes stock market performance data into simple and actionable insights.",
          },
          {
            role: "user",
            content: prompt,
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);
    return "Error generating summary.";
  }
}

const summarizeWithLLM = async(req, res) => {
  try {
    const data = await yahooFinance.historical('AAPL', {
      period1: new Date('2025-01-01'),
      period2: new Date('2025-04-01')
    });

    const formatted = formatHistoricalData(data, "AAPL", "Apple Inc.", "NasdaqGS");

    console.log("Sending all formatted data to GPT in one go...");

    const prompt = `Summarize the following historical stock data for AAPL:\n\n${formatted}`;
    const summary = await callOpenRouter(prompt);

    console.log("Final Summary:\n", summary);
    return res.status(200).json({ summary });

  } catch (err) {
    console.error("Summarization failed:", err.message);
    return "Failed to summarize.";
  }
}

const chatWithStockBot = async (req, res) => {
    const { sessionId, message } = req.body;
  
    if (!isStockRelated(message)) {
      return res.json({ reply: "Please ask only stock-related questions." });
    }
  
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [
        { role: "system", content: "You are a helpful assistant that only answers questions related to stocks and financial markets." }
      ]);
    }
  
    const messages = sessions.get(sessionId);
    messages.push({ role: "user", content: message });
  
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "openai/gpt-3.5-turbo",
          messages: messages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const reply = response.data.choices[0].message.content;
      messages.push({ role: "assistant", content: reply });
      sessions.set(sessionId, messages); 
  
      res.json({ reply });
  
    } catch (err) {
      console.error(err?.response?.data || err.message);
      res.status(500).json({ reply: "Error processing your stock query." });
    }
  };


module.exports = {
	summarizeWithLLM,
    chatWithStockBot
};
