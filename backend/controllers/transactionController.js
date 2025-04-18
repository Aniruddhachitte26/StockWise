const mongoose = require('mongoose');
const Transaction = require('../models/transactionModel');
const Portfolio = require('../models/portfolioModel');

const addTransaction = async (req, res) => {
  const { userId, symbol, type, quantity, price } = req.body;

  try {
    // Create new transaction instance
    const transaction = new Transaction({ userId, symbol, type, quantity, price });

    // Fetch or create the portfolio
    let userPortfolio = await Portfolio.findOne({ userId });

    if (!userPortfolio) {
      userPortfolio = new Portfolio({
        userId: new mongoose.Types.ObjectId(userId),
        stocks: [],
        wallet: 25000,
        investmentFund: 0
      });
    }

    // Find the stock in portfolio (if already exists)
    const stockIndex = userPortfolio.stocks.findIndex(s => s.symbol === symbol);

    if (type === 'BUY') {
      const cost = quantity * price;

      if (userPortfolio.wallet < cost) {
        return res.status(400).json({ error: 'Insufficient funds in wallet' });
      }

      userPortfolio.wallet -= cost;
      userPortfolio.investmentFund += cost;

      if (stockIndex === -1) {
        userPortfolio.stocks.push({
          symbol,
          quantity,
          averagePrice: price,
          investedAmount: cost
        });
      } else {
        const stock = userPortfolio.stocks[stockIndex];
        const totalQty = stock.quantity + quantity;
        const totalInvestment = (stock.quantity * stock.averagePrice) + cost;

        stock.quantity = totalQty;
        stock.averagePrice = totalInvestment / totalQty;
        stock.investedAmount = totalInvestment;
      }
    }

    if (type === 'SELL') {
      if (stockIndex === -1) {
        return res.status(400).json({ error: 'Cannot sell stock not in portfolio' });
      }

      const stock = userPortfolio.stocks[stockIndex];

      if (stock.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough quantity to sell' });
      }

      const sellValue = quantity * price;
      const costBasis = quantity * stock.averagePrice;
      const profitOrLoss = sellValue - costBasis;

      // Add to wallet and reduce investment fund
      userPortfolio.wallet += sellValue;
      userPortfolio.investmentFund -= costBasis;

      // Update quantity/investment
      stock.quantity -= quantity;
      stock.investedAmount = stock.quantity * stock.averagePrice;

      // Remove stock if none left
      if (stock.quantity === 0) {
        userPortfolio.stocks.splice(stockIndex, 1);
      }

      // Save profit/loss to transaction
      transaction.profitOrLoss = profitOrLoss;
    }

    await userPortfolio.save();
    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error in addTransaction:', err);
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


const getTotalProfitOrLoss = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: 'SELL',
            profitOrLoss: { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            totalProfitOrLoss: { $sum: "$profitOrLoss" }
          }
        }
      ]);
  
      const total = result[0]?.totalProfitOrLoss || 0;
  
      res.json({ totalProfitOrLoss: total });
    } catch (err) {
      console.error("Error calculating total profit/loss:", err);
      res.status(500).json({ error: err.message });
    }
};
  

module.exports = {
    getTransactions,
    addTransaction,
    getTotalProfitOrLoss
};
