import React from 'react';

const StockCard = ({ symbol, companyName, price, change, changePercent, onClick }) => {
  const isPositive = (change || 0) >= 0;

  return (
    <div className="stock-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="stock-card-symbol">{symbol}</div>
      <div className="stock-card-name">{companyName}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="stock-card-price">
          {price != null ? `₹${Number(price).toFixed(2)}` : '--'}
        </span>
        {change !== undefined && (
          <span className={`stock-card-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}
            {changePercent !== undefined && ` (${isPositive ? '+' : ''}${typeof changePercent === 'number' ? changePercent.toFixed(2) : changePercent}%)`}
          </span>
        )}
      </div>
    </div>
  );
};

export default StockCard;
