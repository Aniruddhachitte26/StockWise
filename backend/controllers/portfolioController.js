const Portfolio = require('../models/portfolioModel');

const getPortfolio = async (req, res) => {
  const { userId } = req.params;
  try {
    const portfolio = await Portfolio.findOne({ userId });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    getPortfolio
}