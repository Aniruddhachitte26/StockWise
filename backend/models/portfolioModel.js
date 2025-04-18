const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stocks: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      averagePrice: { type: Number, required: true }, // Weighted average
      investedAmount: { type: Number, required: true },
    }
  ],
  totalValue: { type: Number, default: 0 }, // optional, can calculate on demand
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);