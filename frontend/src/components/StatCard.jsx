import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, change, changePercent }) => {
  const isPositive = (change || 0) >= 0;
  const changeClass = change !== undefined ? (isPositive ? 'positive' : 'negative') : '';

  return (
    <div className="stat-card">
      <p className="stat-card-label">{label}</p>
      <h3 className="stat-card-value">{value}</h3>
      {(change !== undefined || changePercent !== undefined) && (
        <div className={`stat-card-change ${changeClass}`}>
          {change !== undefined && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}
            </span>
          )}
          {changePercent !== undefined && (
            <span> ({isPositive ? '+' : ''}{typeof changePercent === 'number' ? changePercent.toFixed(2) : changePercent}%)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
