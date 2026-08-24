import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { getStock, searchStocks } from '../services/stockService';

const POPULAR_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'META'];

const MOCK_STOCKS = {
  AAPL: { symbol: 'AAPL', companyName: 'Apple Inc', price: 15756.72, change: 102.09, changePercent: 0.65 },
  MSFT: { symbol: 'MSFT', companyName: 'Microsoft Corp', price: 35318.16, change: 260.62, changePercent: 0.74 },
  TSLA: { symbol: 'TSLA', companyName: 'Tesla Inc', price: 19268.45, change: -1188.56, changePercent: -5.81 },
  GOOGL: { symbol: 'GOOGL', companyName: 'Alphabet Inc', price: 14461.09, change: 203.35, changePercent: 1.42 },
  NVDA: { symbol: 'NVDA', companyName: 'NVIDIA Corp', price: 72651.56, change: 3498.45, changePercent: 5.06 },
  META: { symbol: 'META', companyName: 'Meta Platforms Inc', price: 42551.61, change: -322.87, changePercent: -0.75 },
};

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const loadPopularStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        POPULAR_SYMBOLS.map((sym) => getStock(sym))
      );
      const loaded = results
        .map((r, i) =>
          r.status === 'fulfilled' ? r.value : MOCK_STOCKS[POPULAR_SYMBOLS[i]]
        )
        .filter(Boolean);
      setStocks(loaded);
    } catch (err) {
      setError(err.message);
      setStocks(Object.values(MOCK_STOCKS));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const results = await searchStocks(query.trim());
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSearchResults(null);
      return;
    }
    debounceRef.current = setTimeout(() => handleSearch(value), 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    handleSearch(searchQuery);
  };

  useEffect(() => {
    loadPopularStocks();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loadPopularStocks]);

  const displayStocks = searchResults !== null ? searchResults : stocks;
  const isSearching = searchResults !== null;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Stocks</h2>
        <p>Search and explore stock listings</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div className="topbar-search" style={{ width: '100%', maxWidth: 480 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={handleInputChange}
            autoFocus
          />
        </div>
      </form>

      {loading ? (
        <LoadingSpinner message="Loading stocks..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadPopularStocks} />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} />
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
              {isSearching ? 'Search Results' : 'Popular Stocks'}
            </h3>
          </div>

          {searching ? (
            <LoadingSpinner message="Searching..." />
          ) : displayStocks.length === 0 ? (
            <EmptyState
              title="No stocks found"
              message={`No results for "${searchQuery}". Try a different search term.`}
            />
          ) : (
            <div className="stock-list">
              {displayStocks.map((stock) => (
                <Link key={stock.symbol} to={`/stock/${stock.symbol}`}>
                  <StockCard
                    symbol={stock.symbol}
                    companyName={stock.companyName}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                  />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stocks;
