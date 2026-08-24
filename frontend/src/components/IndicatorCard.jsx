import React from 'react';

const IndicatorCard = ({ label, value, sub }) => (
  <div className="indicator-card">
    <p className="indicator-label">{label}</p>
    <p className="indicator-value">{value ?? '--'}</p>
    {sub && <p className="indicator-sub">{sub}</p>}
  </div>
);

export default IndicatorCard;
