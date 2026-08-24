const stockDataService = require('../services/stockDataService');
const analyticsService = require('../services/analyticsService');

const compareStocks = async (req, res, next) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols) || symbols.length < 2) {
      return res.status(400).json({
        error: 'Please provide an array of at least 2 symbols',
      });
    }

    const stockData = symbols.map((s) => stockDataService.getStockInfo(s)).filter(Boolean);

    if (stockData.length === 0) {
      return res.status(404).json({ error: 'No valid stocks found' });
    }

    const analyticsResults = await Promise.all(
      stockData.map(async (stock) => {
        const analytics = await analyticsService.getAnalytics(stock.symbol);
        return {
          ...stock,
          indicators: analytics.indicators,
          signal: analytics.signal,
        };
      })
    );

    res.json({
      stocks: stockData,
      comparison: analyticsResults,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { compareStocks };
