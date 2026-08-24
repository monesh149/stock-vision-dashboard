const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true },
  companyName: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
