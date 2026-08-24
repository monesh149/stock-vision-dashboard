const axios = require('axios');

const PYTHON_URL = process.env.PYTHON_ANALYTICS_URL || 'http://localhost:5001';

const flattenIndicators = (pythonData) => {
  const latest = pythonData?.indicators?.latest || {};
  const stats = pythonData?.indicators?.statistics || {};
  const bb = pythonData?.indicators?.bollinger_bands?.latest || {};
  const bbUpper = pythonData?.indicators?.bollinger_bands?.upper;
  const bbLower = pythonData?.indicators?.bollinger_bands?.lower;

  return {
    rsi: latest.rsi ?? null,
    sma20: latest.sma_20 ?? null,
    sma50: latest.sma_50 ?? null,
    sma200: latest.sma_200 ?? null,
    ema20: latest.ema_20 ?? null,
    ema50: latest.ema_50 ?? null,
    macd: latest.macd_line ?? null,
    macdSignal: latest.signal_line ?? null,
    macdHistogram: latest.macd_histogram ?? null,
    bollingerUpper: latest.upper_bb ?? null,
    bollingerLower: latest.lower_bb ?? null,
    bollingerMiddle: latest.middle_bb ?? null,
    volatility: stats.volatility ? stats.volatility / 100 : null,
    dailyReturn: stats.average_return ?? null,
    averageReturn: stats.average_return ?? null,
    maxPrice: stats.max_price ?? null,
    minPrice: stats.min_price ?? null,
    percentageGrowth: stats.percentage_growth ?? null,
    currentPrice: stats.current_price ?? null,
  };
};

const flattenSignal = (pythonData) => {
  const sig = pythonData?.signal || pythonData;
  return {
    signal: (sig.signal || 'HOLD').toUpperCase(),
    confidence: sig.confidence || 0,
    reason: sig.reason || 'No signal data available',
  };
};

const getAnalytics = async (symbol) => {
  try {
    const response = await axios.get(`${PYTHON_URL}/api/analytics/${symbol}`);
    const data = response.data;
    return {
      symbol: symbol.toUpperCase(),
      indicators: flattenIndicators(data),
      signal: flattenSignal(data),
      raw: data,
    };
  } catch (error) {
    return {
      symbol: symbol.toUpperCase(),
      indicators: {
        rsi: 50, sma20: 0, sma50: 0, sma200: 0,
        ema20: 0, ema50: 0, macd: 0, macdSignal: 0, macdHistogram: 0,
        bollingerUpper: 0, bollingerLower: 0, bollingerMiddle: 0,
        volatility: 0, dailyReturn: 0, averageReturn: 0,
        maxPrice: 0, minPrice: 0, percentageGrowth: 0, currentPrice: 0,
      },
      signal: { signal: 'HOLD', confidence: 50, reason: 'Analytics service unavailable' },
    };
  }
};

const getIndicators = async (symbol) => {
  try {
    const response = await axios.get(`${PYTHON_URL}/api/analytics/${symbol}/indicators`);
    const data = response.data;
    return {
      symbol: symbol.toUpperCase(),
      indicators: flattenIndicators(data),
    };
  } catch (error) {
    return {
      symbol: symbol.toUpperCase(),
      indicators: {
        rsi: 50, sma20: 0, sma50: 0, sma200: 0,
        ema20: 0, ema50: 0, macd: 0, macdSignal: 0, macdHistogram: 0,
        bollingerUpper: 0, bollingerLower: 0, bollingerMiddle: 0,
        volatility: 0, dailyReturn: 0, averageReturn: 0,
        maxPrice: 0, minPrice: 0, percentageGrowth: 0, currentPrice: 0,
      },
    };
  }
};

const getSignal = async (symbol) => {
  try {
    const response = await axios.get(`${PYTHON_URL}/api/analytics/${symbol}/signal`);
    const data = response.data;
    return {
      symbol: symbol.toUpperCase(),
      ...flattenSignal(data),
    };
  } catch (error) {
    return {
      symbol: symbol.toUpperCase(),
      signal: 'HOLD',
      confidence: 50,
      reason: 'Analytics service unavailable',
    };
  }
};

const compareStocks = async (symbols) => {
  try {
    const response = await axios.post(`${PYTHON_URL}/api/analytics/compare`, { symbols });
    return response.data;
  } catch (error) {
    return {
      results: symbols.map((s) => ({
        symbol: s.toUpperCase(),
        signal: { signal: 'HOLD', confidence: 50, reason: 'Service unavailable' },
      })),
      errors: [],
    };
  }
};

module.exports = { getAnalytics, getIndicators, getSignal, compareStocks };
