const Watchlist = require('../models/watchlistModel');

const getWatchlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const watchlist = await Watchlist.findOne({ userId });
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToWatchlist = async (req, res) => {
  const { userId, symbol } = req.body;
  try {
    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, symbols: [symbol] });
    } else if (!watchlist.symbols.includes(symbol)) {
      watchlist.symbols.push(symbol);
    }
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  const { userId, symbol } = req.body;
  try {
    const watchlist = await Watchlist.findOne({ userId });
    watchlist.symbols = watchlist.symbols.filter(s => s !== symbol);
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
}