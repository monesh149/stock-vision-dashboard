const MOCK_DATA = {
  AAPL: {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    price: 15756.72,
    change: 2.31,
    changePercent: 1.23,
    volume: 54321000,
    marketCap: 2950000000000,
    high52Week: 16568.46,
    low52Week: 10306.11,
    sector: 'Technology',
    industry: 'Consumer Electronics',
  },
  MSFT: {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    price: 31449.53,
    change: -1.54,
    changePercent: -0.41,
    volume: 22145000,
    marketCap: 2810000000000,
    high52Week: 31896.90,
    low52Week: 20385.63,
    sector: 'Technology',
    industry: 'Software Infrastructure',
  },
  TSLA: {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    price: 20618.86,
    change: 8.76,
    changePercent: 3.65,
    volume: 118970000,
    marketCap: 790000000000,
    high52Week: 24841.07,
    low52Week: 8450.23,
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
  },
  AMZN: {
    symbol: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    price: 14794.75,
    change: 1.08,
    changePercent: 0.61,
    volume: 47830000,
    marketCap: 1840000000000,
    high52Week: 15750.91,
    low52Week: 9823.05,
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
  },
  GOOGL: {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    price: 11769.40,
    change: -0.92,
    changePercent: -0.64,
    volume: 25640000,
    marketCap: 1790000000000,
    high52Week: 12763.74,
    low52Week: 6926.35,
    sector: 'Technology',
    industry: 'Internet Content & Information',
  },
  NVDA: {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    price: 41103.26,
    change: 12.45,
    changePercent: 2.58,
    volume: 56780000,
    marketCap: 1220000000000,
    high52Week: 41720.78,
    low52Week: 18506.51,
    sector: 'Technology',
    industry: 'Semiconductors',
  },
  META: {
    symbol: 'META',
    companyName: 'Meta Platforms, Inc.',
    price: 29521.44,
    change: 4.21,
    changePercent: 1.20,
    volume: 18920000,
    marketCap: 910000000000,
    high52Week: 31899.39,
    low52Week: 7311.47,
    sector: 'Technology',
    industry: 'Social Media',
  },
  NFLX: {
    symbol: 'NFLX',
    companyName: 'Netflix, Inc.',
    price: 40281.56,
    change: -3.87,
    changePercent: -0.79,
    volume: 8940000,
    marketCap: 210000000000,
    high52Week: 41864.37,
    low52Week: 24050.75,
    sector: 'Communication Services',
    industry: 'Entertainment',
  },
  AMD: {
    symbol: 'AMD',
    companyName: 'Advanced Micro Devices, Inc.',
    price: 10080.35,
    change: 3.18,
    changePercent: 2.68,
    volume: 62340000,
    marketCap: 196000000000,
    high52Week: 11024.89,
    low52Week: 4529.31,
    sector: 'Technology',
    industry: 'Semiconductors',
  },
  INTC: {
    symbol: 'INTC',
    companyName: 'Intel Corporation',
    price: 3583.11,
    change: -0.62,
    changePercent: -1.42,
    volume: 41250000,
    marketCap: 182000000000,
    high52Week: 4256.24,
    low52Week: 2229.38,
    sector: 'Technology',
    industry: 'Semiconductors',
  },
  JPM: {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    price: 14305.05,
    change: 0.89,
    changePercent: 0.52,
    volume: 11560000,
    marketCap: 502000000000,
    high52Week: 14559.86,
    low52Week: 10218.13,
    sector: 'Financial Services',
    industry: 'Banking',
  },
  V: {
    symbol: 'V',
    companyName: 'Visa Inc.',
    price: 21706.99,
    change: 1.34,
    changePercent: 0.51,
    volume: 7840000,
    marketCap: 538000000000,
    high52Week: 22903.02,
    low52Week: 17124.56,
    sector: 'Financial Services',
    industry: 'Credit Services',
  },
  WMT: {
    symbol: 'WMT',
    companyName: 'Walmart Inc.',
    price: 13563.86,
    change: 0.56,
    changePercent: 0.34,
    volume: 9870000,
    marketCap: 440000000000,
    high52Week: 14105.02,
    low52Week: 11533.68,
    sector: 'Consumer Defensive',
    industry: 'Retail - Defensive',
  },
  DIS: {
    symbol: 'DIS',
    companyName: 'The Walt Disney Company',
    price: 7791.21,
    change: -1.23,
    changePercent: -1.29,
    volume: 14230000,
    marketCap: 172000000000,
    high52Week: 9808.94,
    low52Week: 6534.59,
    sector: 'Communication Services',
    industry: 'Entertainment',
  },
  BA: {
    symbol: 'BA',
    companyName: 'The Boeing Company',
    price: 17815.95,
    change: 5.12,
    changePercent: 2.44,
    volume: 8920000,
    marketCap: 129000000000,
    high52Week: 22205.82,
    low52Week: 13256.76,
    sector: 'Industrials',
    industry: 'Aerospace & Defense',
  },
};

function generatePriceHistory(currentPrice, days) {
  const history = [];
  let price = currentPrice * (0.85 + Math.random() * 0.15);
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = 0.02;
    const drift = (currentPrice - price) / (price * Math.max(i, 1));
    const change = price * (drift + volatility * (Math.random() - 0.48));
    price = Math.max(price + change, currentPrice * 0.5);

    const open = parseFloat(price.toFixed(2));
    const high = parseFloat((open + Math.abs(open * volatility * Math.random())).toFixed(2));
    const low = parseFloat((open - Math.abs(open * volatility * Math.random())).toFixed(2));
    const close = parseFloat((open + (Math.random() - 0.48) * open * volatility).toFixed(2));
    const volume = Math.floor(10000000 + Math.random() * 50000000);

    history.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
  }

  if (history.length > 0) {
    history[history.length - 1].close = currentPrice;
  }

  return history;
}

const getStockInfo = (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const stock = MOCK_DATA[upperSymbol];
  if (!stock) return null;
  return { ...stock };
};

const getStockHistory = (symbol, period = '1M') => {
  const upperSymbol = symbol.toUpperCase();
  const stock = MOCK_DATA[upperSymbol];
  if (!stock) return null;

  const periodDays = {
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '5Y': 1825,
  };

  const days = periodDays[period] || 30;
  return generatePriceHistory(stock.price, days);
};

const searchStocks = (query) => {
  const upperQuery = query.toUpperCase();
  return Object.values(MOCK_DATA).filter(
    (stock) =>
      stock.symbol.includes(upperQuery) ||
      stock.companyName.toUpperCase().includes(upperQuery)
  );
};

const getMarketOverview = () => {
  const stocks = Object.values(MOCK_DATA);

  const sortedByChange = [...stocks].sort(
    (a, b) => b.changePercent - a.changePercent
  );

  return {
    indices: [
      { name: 'S&P 500', value: 4783.35, change: 23.12, changePercent: 0.49 },
      { name: 'Dow Jones', value: 37689.54, change: 138.01, changePercent: 0.37 },
      { name: 'NASDAQ', value: 15011.35, change: 87.48, changePercent: 0.59 },
    ],
    gainers: sortedByChange.slice(0, 5),
    losers: sortedByChange.slice(-5).reverse(),
    mostActive: [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5),
  };
};

module.exports = {
  getStockInfo,
  getStockHistory,
  searchStocks,
  getMarketOverview,
};
