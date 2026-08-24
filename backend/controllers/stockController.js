const stockDataService = require('../services/stockDataService');

const getStock = (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stock = stockDataService.getStockInfo(symbol);
    if (!stock) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }
    res.json(stock);
  } catch (error) {
    next(error);
  }
};

const getStockHistory = (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { period } = req.query;
    const history = stockDataService.getStockHistory(symbol, period);
    if (!history) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }
    res.json(history);
  } catch (error) {
    next(error);
  }
};

const searchStocks = (req, res, next) => {
  try {
    const { query } = req.params;
    const results = stockDataService.searchStocks(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStock, getStockHistory, searchStocks };
