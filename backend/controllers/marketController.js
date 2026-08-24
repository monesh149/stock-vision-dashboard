const stockDataService = require('../services/stockDataService');

const getMarketOverview = (req, res, next) => {
  try {
    const overview = stockDataService.getMarketOverview();
    res.json({
      marketStatus: 'Open',
      indices: overview.indices,
      topGainers: overview.gainers,
      topLosers: overview.losers,
      mostActive: overview.mostActive,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarketOverview };
