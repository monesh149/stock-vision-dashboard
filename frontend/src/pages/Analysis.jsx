import { useState, useEffect } from 'react';
import { Search, BarChart3, TrendingUp } from 'lucide-react';
import { getAnalysis } from '../services/analysisService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import IndicatorCard from '../components/IndicatorCard';
import SignalCard from '../components/SignalCard';

export default function Analysis() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchInput, setSearchInput] = useState('AAPL');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis(symbol);
  }, [symbol]);

  const fetchAnalysis = async (sym) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalysis(sym);
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSymbol(searchInput.trim().toUpperCase());
    }
  };

  if (loading) return <LoadingSpinner message="Calculating technical indicators..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchAnalysis(symbol)} />;

  const ind = analysis?.indicators || {};

  const getRSISub = (rsi) => {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    return 'Neutral';
  };

  const getMACDSub = (macd) => {
    if (macd > 0) return 'Bullish';
    if (macd < 0) return 'Bearish';
    return 'Neutral';
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <BarChart3 size={24} />
          <h2>Technical Analysis</h2>
        </div>
        <p>In-depth stock indicators and signals</p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 400 }}>
          <div className="topbar-search" style={{ flex: 1 }}>
            <Search size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter stock symbol (e.g. AAPL)"
            />
          </div>
          <button type="submit" className="btn btn-primary">Analyze</button>
        </div>
      </form>

      {analysis && (
        <>
          {analysis.stock && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600 }}>{analysis.stock.symbol}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{analysis.stock.companyName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 24, fontWeight: 700 }}>₹{analysis.stock.price?.toFixed(2)}</p>
                  <p className={analysis.stock.change >= 0 ? 'positive' : 'negative'} style={{ fontSize: 14 }}>
                    {analysis.stock.change >= 0 ? '+' : ''}{analysis.stock.change?.toFixed(2)} ({analysis.stock.changePercent?.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} />
            Technical Indicators
          </h3>
          <div className="indicator-grid" style={{ marginBottom: 24 }}>
            {ind.rsi != null && (
              <IndicatorCard label="RSI (14)" value={ind.rsi.toFixed(2)} sub={getRSISub(ind.rsi)} />
            )}
            {ind.sma20 != null && (
              <IndicatorCard label="SMA 20" value={`₹${ind.sma20.toFixed(2)}`} />
            )}
            {ind.sma50 != null && (
              <IndicatorCard label="SMA 50" value={`₹${ind.sma50.toFixed(2)}`} />
            )}
            {ind.sma200 != null && (
              <IndicatorCard label="SMA 200" value={`₹${ind.sma200.toFixed(2)}`} />
            )}
            {ind.ema20 != null && (
              <IndicatorCard label="EMA 20" value={`₹${ind.ema20.toFixed(2)}`} />
            )}
            {ind.ema50 != null && (
              <IndicatorCard label="EMA 50" value={`₹${ind.ema50.toFixed(2)}`} />
            )}
            {ind.macd != null && (
              <IndicatorCard label="MACD" value={ind.macd.toFixed(4)} sub={getMACDSub(ind.macd)} />
            )}
            {ind.bollingerUpper != null && (
              <IndicatorCard
                label="Bollinger Bands"
                value={`U: ₹${ind.bollingerUpper.toFixed(2)}`}
                sub={`M: ₹${(ind.bollingerMiddle || 0).toFixed(2)} / L: ₹${(ind.bollingerLower || 0).toFixed(2)}`}
              />
            )}
            {ind.volatility != null && (
              <IndicatorCard label="Volatility" value={`${(ind.volatility * 100).toFixed(1)}%`} />
            )}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Performance Metrics</h3>
          <div className="indicator-grid" style={{ marginBottom: 24 }}>
            {ind.dailyReturn != null && (
              <IndicatorCard
                label="Daily Return"
                value={`${ind.dailyReturn.toFixed(2)}%`}
                sub={ind.dailyReturn >= 0 ? 'Positive' : 'Negative'}
              />
            )}
            {ind.averageReturn != null && (
              <IndicatorCard label="Average Return" value={`${ind.averageReturn.toFixed(2)}%`} />
            )}
            {ind.maxPrice != null && (
              <IndicatorCard label="Max Price" value={`₹${ind.maxPrice.toFixed(2)}`} />
            )}
            {ind.minPrice != null && (
              <IndicatorCard label="Min Price" value={`₹${ind.minPrice.toFixed(2)}`} />
            )}
            {ind.percentageGrowth != null && (
              <IndicatorCard
                label="Percentage Growth"
                value={`${ind.percentageGrowth.toFixed(2)}%`}
                sub={ind.percentageGrowth >= 0 ? 'Positive' : 'Negative'}
              />
            )}
          </div>

          {analysis.signal && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recommendation</h3>
              <SignalCard signal={analysis.signal} />
            </div>
          )}

          <div className="disclaimer">
            <strong>Disclaimer:</strong> StockVision provides educational analysis and is not financial advice.
            Always conduct your own research before making investment decisions.
          </div>
        </>
      )}
    </div>
  );
}
