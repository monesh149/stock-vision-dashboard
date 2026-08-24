const stockDataService = require('../services/stockDataService');
const analyticsService = require('../services/analyticsService');

const getAnalysis = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stockData = stockDataService.getStockInfo(symbol);
    if (!stockData) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }

    const analytics = await analyticsService.getAnalytics(symbol);

    res.json({
      symbol: symbol.toUpperCase(),
      stock: stockData,
      indicators: analytics.indicators,
      signal: analytics.signal,
    });
  } catch (error) {
    next(error);
  }
};

const getIndicators = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stockData = stockDataService.getStockInfo(symbol);
    if (!stockData) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }

    const indicators = await analyticsService.getIndicators(symbol);
    res.json({
      symbol: symbol.toUpperCase(),
      indicators: indicators.indicators,
    });
  } catch (error) {
    next(error);
  }
};

const getSignal = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stockData = stockDataService.getStockInfo(symbol);
    if (!stockData) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }

    const signal = await analyticsService.getSignal(symbol);
    res.json({
      symbol: symbol.toUpperCase(),
      signal: signal.signal,
      confidence: signal.confidence,
      reason: signal.reason,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalysis, getIndicators, getSignal };
