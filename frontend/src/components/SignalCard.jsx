import React from 'react';

const SignalCard = ({ signal }) => {
  if (!signal) return null;

  const { signal: signalType, confidence, reason } = signal;
  const normalized = (signalType || 'HOLD').toUpperCase();
  const badgeClass =
    normalized === 'BUY' ? 'buy' :
    normalized === 'SELL' ? 'sell' : 'hold';

  return (
    <div className="signal-card">
      <span className={`signal-badge ${badgeClass}`}>{normalized}</span>
      <div className="signal-confidence">
        {confidence != null ? `${confidence}%` : '--'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Confidence</div>
      {reason && (
        <p className="signal-reason">{reason}</p>
      )}
      <div className="disclaimer" style={{ marginTop: 16 }}>
        StockVision provides educational analysis and is not financial advice.
      </div>
    </div>
  );
};

export default SignalCard;
