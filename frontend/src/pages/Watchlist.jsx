import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { getWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { getStock } from '../services/stockService';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getWatchlist();
      setWatchlist(items);

      const stockData = {};
      await Promise.all(
        items.map(async (item) => {
          try {
            const data = await getStock(item.symbol);
            stockData[item.symbol] = data;
          } catch (err) {
            console.error(`Failed to fetch stock data for ${item.symbol}:`, err);
          }
        })
      );
      setStocks(stockData);
    } catch (err) {
      setError(err.message || 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
      setStocks((prev) => {
        const next = { ...prev };
        delete next[symbol];
        return next;
      });
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading watchlist..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchWatchlist} />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Bookmark size={24} />
          <h2>Watchlist</h2>
        </div>
        <p>Your saved stocks</p>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <EmptyState
            title="Your watchlist is empty"
            message="Start tracking stocks you're interested in."
          />
          <Link to="/stocks" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Discover Stocks
          </Link>
        </div>
      ) : (
        <div className="stock-list">
          {watchlist.map((item) => {
            const stock = stocks[item.symbol];
            return (
              <div key={item.symbol} style={{ position: 'relative' }}>
                <Link to={`/stock/${item.symbol}`} style={{ display: 'block' }}>
                  <StockCard
                    symbol={item.symbol}
                    companyName={stock?.companyName || item.companyName || item.symbol}
                    price={stock?.price}
                    change={stock?.change}
                    changePercent={stock?.changePercent}
                  />
                </Link>
                <button
                  onClick={() => handleRemove(item.symbol)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    color: 'var(--text-muted)',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-dim)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                  title="Remove from watchlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
