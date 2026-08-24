const Watchlist = require('../models/Watchlist');

const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find().sort({ addedAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol, companyName } = req.body;
    if (!symbol || !companyName) {
      return res.status(400).json({ error: 'Symbol and companyName are required' });
    }

    const existing = await Watchlist.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(409).json({ error: `${symbol} is already in your watchlist` });
    }

    const item = await Watchlist.create({
      symbol: symbol.toUpperCase(),
      companyName,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const item = await Watchlist.findOneAndDelete({ symbol: symbol.toUpperCase() });
    if (!item) {
      return res.status(404).json({ error: `${symbol} not found in watchlist` });
    }
    res.json({ message: `${symbol} removed from watchlist` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
