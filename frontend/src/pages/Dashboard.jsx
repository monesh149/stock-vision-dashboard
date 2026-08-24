import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Activity, BarChart3, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getMarketOverview } from '../services/marketService';
import { getStock } from '../services/stockService';

const MOCK_OVERVIEW = {
  marketStatus: 'Open',
  indices: [
    { name: 'S&P 500', value: 5823.45, change: 12.67, changePercent: 0.22 },
    { name: 'NASDAQ', value: 18456.12, change: -45.23, changePercent: -0.24 },
    { name: 'DOW', value: 43125.67, change: 89.34, changePercent: 0.21 },
  ],
  topGainers: [
    { symbol: 'NVDA', companyName: 'NVIDIA Corp', price: 72651.56, change: 3498.45, changePercent: 5.06 },
    { symbol: 'SMCI', companyName: 'Super Micro Computer', price: 75733.35, change: 3213.76, changePercent: 4.42 },
    { symbol: 'AMD', companyName: 'Advanced Micro Devices', price: 14850.36, change: 566.89, changePercent: 3.97 },
  ],
  topLosers: [
    { symbol: 'TSLA', companyName: 'Tesla Inc', price: 19268.45, change: -1188.56, changePercent: -5.81 },
    { symbol: 'NFLX', companyName: 'Netflix Inc', price: 52161.35, change: -1840.94, changePercent: -3.41 },
    { symbol: 'PYPL', companyName: 'PayPal Holdings', price: 5210.74, change: -161.85, changePercent: -3.01 },
  ],
  mostActive: [
    { symbol: 'AAPL', companyName: 'Apple Inc', price: 15756.72, change: 102.09, changePercent: 0.65 },
    { symbol: 'AMZN', companyName: 'Amazon.com Inc', price: 15464.56, change: -72.21, changePercent: -0.46 },
    { symbol: 'MSFT', companyName: 'Microsoft Corp', price: 35318.16, change: 260.62, changePercent: 0.74 },
  ],
};

const MOCK_STOCK = {
  symbol: 'AAPL',
  companyName: 'Apple Inc',
  price: 15756.72,
  change: 102.09,
  changePercent: 0.65,
  volume: 52_430_000,
  high52Week: 16568.46,
  low52Week: 11943.70,
  marketCap: '2.95T',
  pe: 30.2,
};

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, stockData] = await Promise.all([
        getMarketOverview().catch(() => null),
        getStock('AAPL').catch(() => null),
      ]);
      setOverview(overviewData || MOCK_OVERVIEW);
      setFeatured(stockData || MOCK_STOCK);
    } catch (err) {
      setError(err.message);
      setOverview(MOCK_OVERVIEW);
      setFeatured(MOCK_STOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error && !overview) return <ErrorMessage message={error} onRetry={fetchData} />;

  const ov = overview || MOCK_OVERVIEW;
  const stock = featured || MOCK_STOCK;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Market overview and key metrics</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Market Status" value={ov.marketStatus} />
        <StatCard label="Current Price" value={`₹${stock.price?.toFixed(2)}`} change={stock.change} changePercent={stock.changePercent} />
        <StatCard label="Daily Change" value={`${stock.change >= 0 ? '+' : ''}${stock.changePercent}%`} change={stock.change} changePercent={stock.changePercent} />
        <StatCard label="Volume" value={stock.volume ? `${(stock.volume / 1_000_000).toFixed(1)}M` : 'N/A'} />
        <StatCard label="52-Week High" value={stock.high52Week ? `₹${stock.high52Week.toFixed(2)}` : 'N/A'} />
        <StatCard label="52-Week Low" value={stock.low52Week ? `₹${stock.low52Week.toFixed(2)}` : 'N/A'} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} />
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Market Movers</h3>
          </div>
        </div>
        <div className="grid-3">
          {[
            { title: 'Top Gainers', items: ov.topGainers },
            { title: 'Top Losers', items: ov.topLosers },
            { title: 'Most Active', items: ov.mostActive },
          ].map((section) => (
            <div key={section.title} className="card" style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
                {section.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items?.map((s) => (
                  <Link key={s.symbol} to={`/stock/${s.symbol}`}>
                    <StockCard
                      symbol={s.symbol}
                      companyName={s.companyName}
                      price={s.price}
                      change={s.change}
                      changePercent={s.changePercent}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Featured Stock</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Apple Inc (AAPL)</p>
          </div>
          <Link to={`/stock/${stock.symbol}`} className="btn btn-secondary btn-sm">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
        <div className="stat-grid" style={{ marginBottom: 0 }}>
          <StatCard label="Price" value={`₹${stock.price?.toFixed(2)}`} change={stock.change} changePercent={stock.changePercent} />
          <StatCard label="Market Cap" value={stock.marketCap || 'N/A'} />
          <StatCard label="P/E Ratio" value={stock.pe || 'N/A'} />
          <StatCard label="Volume" value={stock.volume ? `${(stock.volume / 1_000_000).toFixed(1)}M` : 'N/A'} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
