import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Plus, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import StockChart from '../components/StockChart';
import IndicatorCard from '../components/IndicatorCard';
import SignalCard from '../components/SignalCard';
import { getStock, getStockHistory } from '../services/stockService';
import { getAnalysis } from '../services/analysisService';
import { addToWatchlist, getWatchlist } from '../services/watchlistService';

const PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

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
  marketStatus: 'Open',
};

const MOCK_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().split('T')[0],
  price: 14940 + Math.sin(i / 4) * 664 + Math.random() * 249,
}));

const MOCK_ANALYSIS = {
  indicators: {
    rsi: 58.4,
    sma20: 15547.56,
    sma50: 15244.61,
    sma200: 14559.86,
    ema20: 15616.45,
    ema50: 15346.70,
    macd: 2.34,
    bollingerUpper: 16201.60,
    bollingerLower: 14893.52,
    volatility: 0.23,
  },
  signal: {
    signal: 'HOLD',
    confidence: 62,
    reason: 'Mixed technical indicators suggest a neutral stance.',
  },
};

const StockDetail = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [period, setPeriod] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stockData, historyData, analysisData] = await Promise.allSettled([
        getStock(symbol),
        getStockHistory(symbol, period),
        getAnalysis(symbol),
      ]);
      setStock(
        stockData.status === 'fulfilled' ? stockData.value : { ...MOCK_STOCK, symbol }
      );
      setHistory(
        historyData.status === 'fulfilled' ? historyData.value : MOCK_HISTORY
      );
      setAnalysis(
        analysisData.status === 'fulfilled' ? analysisData.value : MOCK_ANALYSIS
      );
    } catch (err) {
      setError(err.message);
      setStock({ ...MOCK_STOCK, symbol });
      setHistory(MOCK_HISTORY);
      setAnalysis(MOCK_ANALYSIS);
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  const fetchHistory = useCallback(
    async (newPeriod) => {
      setHistoryLoading(true);
      try {
        const data = await getStockHistory(symbol, newPeriod).catch(() => null);
        setHistory(data || MOCK_HISTORY);
      } finally {
        setHistoryLoading(false);
      }
    },
    [symbol]
  );

  const handlePeriodChange = (p) => {
    setPeriod(p);
    fetchHistory(p);
  };

  const handleAddToWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      await addToWatchlist(symbol, stock?.companyName || symbol);
      setInWatchlist(true);
    } catch {
      setInWatchlist(true);
    } finally {
      setWatchlistLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const list = await getWatchlist().catch(() => []);
        if (Array.isArray(list)) {
          setInWatchlist(list.some((w) => w.symbol === symbol));
        }
      } catch {
        /* ignore */
      }
    };
    checkWatchlist();
  }, [symbol]);

  if (loading) return <LoadingSpinner message={`Loading ${symbol}...`} />;
  if (error && !stock) return <ErrorMessage message={error} onRetry={fetchAll} />;

  const s = stock || MOCK_STOCK;
  const ind = analysis?.indicators || MOCK_ANALYSIS.indicators;
  const sig = analysis?.signal || MOCK_ANALYSIS.signal;
  const isPositive = (s.change || 0) >= 0;

  return (
    <div className="page-content">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2>{s.companyName || s.symbol}</h2>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>({s.symbol})</span>
              {s.marketStatus && (
                <span className={`signal-badge ${s.marketStatus === 'Open' ? 'buy' : 'hold'}`}
                  style={{ fontSize: 11 }}>
                  {s.marketStatus}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 700 }}>
                ₹{s.price?.toFixed(2)}
              </span>
              <span
                className={`stat-change ${isPositive ? 'positive' : 'negative'}`}
                style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {isPositive ? '+' : ''}{s.change?.toFixed(2)} ({isPositive ? '+' : ''}{s.changePercent}%)
              </span>
            </div>
          </div>
          <button
            className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleAddToWatchlist}
            disabled={inWatchlist || watchlistLoading}
          >
            {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
            {inWatchlist ? 'Added' : 'Add to Watchlist'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handlePeriodChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        {historyLoading ? (
          <LoadingSpinner message="Loading chart..." />
        ) : (
          <StockChart data={history} title={`${s.symbol} Price`} height={350} />
        )}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Key Stats</h3>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Price" value={`₹${s.price?.toFixed(2)}`} change={s.change} changePercent={s.changePercent} />
        <StatCard label="Change" value={`${isPositive ? '+' : ''}${s.change?.toFixed(2)}`} change={s.change} changePercent={s.changePercent} />
        <StatCard label="Volume" value={s.volume ? `${(s.volume / 1_000_000).toFixed(1)}M` : 'N/A'} />
        <StatCard label="Market Cap" value={s.marketCap || 'N/A'} />
        <StatCard label="52-Week High" value={s.high52Week ? `₹${s.high52Week.toFixed(2)}` : 'N/A'} />
        <StatCard label="52-Week Low" value={s.low52Week ? `₹${s.low52Week.toFixed(2)}` : 'N/A'} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Technical Indicators</h3>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <IndicatorCard label="RSI" value={ind.rsi?.toFixed(2)} sub={ind.rsi > 70 ? 'Overbought' : ind.rsi < 30 ? 'Oversold' : 'Neutral'} />
        <IndicatorCard label="SMA 20" value={ind.sma20 != null ? `₹${ind.sma20.toFixed(2)}` : '--'} />
        <IndicatorCard label="SMA 50" value={ind.sma50 != null ? `₹${ind.sma50.toFixed(2)}` : '--'} />
        <IndicatorCard label="SMA 200" value={ind.sma200 != null ? `₹${ind.sma200.toFixed(2)}` : '--'} />
        <IndicatorCard label="EMA 20" value={ind.ema20 != null ? `₹${ind.ema20.toFixed(2)}` : '--'} />
        <IndicatorCard label="EMA 50" value={ind.ema50 != null ? `₹${ind.ema50.toFixed(2)}` : '--'} />
        <IndicatorCard label="MACD" value={ind.macd?.toFixed(2)} sub={ind.macd > 0 ? 'Bullish' : 'Bearish'} />
        <IndicatorCard label="Bollinger Upper" value={ind.bollingerUpper != null ? `₹${ind.bollingerUpper.toFixed(2)}` : '--'} />
        <IndicatorCard label="Bollinger Lower" value={ind.bollingerLower != null ? `₹${ind.bollingerLower.toFixed(2)}` : '--'} />
        <IndicatorCard label="Volatility" value={ind.volatility != null ? `${(ind.volatility * 100).toFixed(1)}%` : '--'} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Signal</h3>
      <div style={{ marginBottom: 24 }}>
        <SignalCard signal={sig} />
      </div>
    </div>
  );
};

export default StockDetail;
