import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, X, Search } from 'lucide-react';
import CompareTable from '../components/CompareTable';
import StockChart from '../components/StockChart';
import SignalCard from '../components/SignalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { compareStocks, getAnalysis } from '../services/analysisService';
import { searchStocks, getStockHistory } from '../services/stockService';

const MAX_STOCKS = 4;
const MIN_STOCKS = 2;

const MOCK_COMPARE_DATA = [
  {
    symbol: 'AAPL', companyName: 'Apple Inc', price: 15756.72, change: 102.09, changePercent: 0.65,
    high52Week: 16568.46, low52Week: 11943.70, rsi: 58.4, sma50: 15244.61, sma200: 14559.86,
    volatility: 0.23, signal: 'HOLD', confidence: 62, reason: 'Neutral technical indicators.',
  },
  {
    symbol: 'MSFT', companyName: 'Microsoft Corp', price: 31449.53, change: 260.62, changePercent: 0.74,
    high52Week: 33074.06, low52Week: 30114.09, rsi: 62.1, sma50: 34718.90, sma200: 32794.96,
    volatility: 0.19, signal: 'BUY', confidence: 71, reason: 'Strong uptrend with bullish indicators.',
  },
];

const COMPARE_INDICATORS = [
  'price', 'change', 'changePercent', 'high52Week', 'low52Week',
  'rsi', 'sma50', 'sma200', 'volatility', 'signal',
];

const StockSearchInput = ({ index, value, onSelect, onRemove, canRemove }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchStocks(q.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setQuery(val);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 300);
  };

  const handleSelect = (item) => {
    onSelect(index, item.symbol);
    setQuery(item.symbol);
    setShowDropdown(false);
    setResults([]);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1, minWidth: 180 }}>
      <div className="topbar-search" style={{ width: '100%' }}>
        <Search size={16} />
        <input
          type="text"
          placeholder={`Stock ${index + 1}`}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowDropdown(true)}
          style={{ flex: 1 }}
        />
        {canRemove && (
          <button
            onClick={() => {
              setQuery('');
              onRemove(index);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: 8, maxHeight: 200, overflowY: 'auto', marginTop: 4,
        }}>
          {results.map((r) => (
            <div
              key={r.symbol}
              onClick={() => handleSelect(r)}
              style={{
                padding: '8px 12px', cursor: 'pointer', display: 'flex',
                justifyContent: 'space-between', fontSize: 13,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontWeight: 600 }}>{r.symbol}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{r.companyName}</span>
            </div>
          ))}
        </div>
      )}
      {searching && showDropdown && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 12, marginTop: 4, fontSize: 13,
          color: 'var(--text-secondary)', textAlign: 'center',
        }}>
          Searching...
        </div>
      )}
    </div>
  );
};

const Compare = () => {
  const [selectedSymbols, setSelectedSymbols] = useState(['AAPL', 'MSFT']);
  const [stocksData, setStocksData] = useState([]);
  const [histories, setHistories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (symbols) => {
    if (symbols.length < MIN_STOCKS) {
      setStocksData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        symbols.map(async (sym) => {
          const analysis = await getAnalysis(sym).catch(() => null);
          const mock = MOCK_COMPARE_DATA.find((m) => m.symbol === sym);
          if (analysis) {
            return {
              symbol: sym,
              companyName: analysis.companyName || mock?.companyName || sym,
              price: analysis.price ?? mock?.price,
              change: analysis.change ?? mock?.change,
              changePercent: analysis.changePercent ?? mock?.changePercent,
              high52Week: analysis.high52Week ?? mock?.high52Week,
              low52Week: analysis.low52Week ?? mock?.low52Week,
              rsi: analysis.indicators?.rsi ?? mock?.rsi,
              sma50: analysis.indicators?.sma50 ?? mock?.sma50,
              sma200: analysis.indicators?.sma200 ?? mock?.sma200,
              volatility: analysis.indicators?.volatility ?? mock?.volatility,
              signal: analysis.signal?.signal ?? mock?.signal,
              confidence: analysis.signal?.confidence ?? mock?.confidence,
              reason: analysis.signal?.reason ?? mock?.reason,
            };
          }
          return mock ? { ...mock, symbol: sym } : { symbol: sym };
        })
      );

      const valid = results
        .map((r, i) => (r.status === 'fulfilled' ? r.value : { ...MOCK_COMPARE_DATA[0], symbol: symbols[i] }))
        .filter(Boolean);

      setStocksData(valid);

      const histResults = await Promise.allSettled(
        symbols.map((sym) => getStockHistory(sym, '1M').catch(() => null))
      );
      const histMap = {};
      histResults.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value) {
          histMap[symbols[i]] = r.value;
        }
      });
      setHistories(histMap);
    } catch (err) {
      setError(err.message);
      setStocksData(
        symbols.map((sym) => {
          const mock = MOCK_COMPARE_DATA.find((m) => m.symbol === sym);
          return mock ? { ...mock, symbol: sym } : { symbol: sym };
        })
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedSymbols);
  }, [selectedSymbols, fetchData]);

  const handleSelect = (index, symbol) => {
    setSelectedSymbols((prev) => {
      const next = [...prev];
      next[index] = symbol;
      return next;
    });
  };

  const handleRemove = (index) => {
    setSelectedSymbols((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSlot = () => {
    if (selectedSymbols.length < MAX_STOCKS) {
      setSelectedSymbols((prev) => [...prev, '']);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Compare Stocks</h2>
        <p>Side-by-side stock analysis</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        {selectedSymbols.map((sym, i) => (
          <StockSearchInput
            key={i}
            index={i}
            value={sym}
            onSelect={handleSelect}
            onRemove={handleRemove}
            canRemove={selectedSymbols.length > MIN_STOCKS}
          />
        ))}
        {selectedSymbols.length < MAX_STOCKS && (
          <button className="btn btn-secondary btn-sm" onClick={handleAddSlot} style={{ height: 38, flexShrink: 0 }}>
            <Plus size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Comparing stocks..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchData(selectedSymbols)} />
      ) : stocksData.length < MIN_STOCKS ? (
        <EmptyState title="Select stocks to compare" message="Choose at least 2 stocks from the inputs above to see a comparison." />
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Comparison Table</h3>
            <CompareTable stocks={stocksData} indicators={COMPARE_INDICATORS} />
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Price Comparison</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedSymbols.map((sym) =>
                histories[sym] ? (
                  <StockChart key={sym} data={histories[sym]} title={sym} height={200} />
                ) : null
              )}
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Signals</h3>
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            {stocksData.map((s) => (
              <div key={s.symbol} className="card" style={{ padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{s.symbol}</p>
                <SignalCard signal={{ signal: s.signal, confidence: s.confidence, reason: s.reason }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Compare;
