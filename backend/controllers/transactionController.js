const Transaction = require('../models/Transaction');

const addTransaction = async (req, res) => {
  const { userId, symbol, type, quantity, price } = req.body;
  try {
    const transaction = new Transaction({ userId, symbol, type, quantity, price });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getTransactions,
    addTransaction
};
