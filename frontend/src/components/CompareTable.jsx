import React from 'react';

const CompareTable = ({ stocks = [], indicators = [] }) => {
  const formatValue = (val) => {
    if (val == null || val === '') return '--';
    if (typeof val === 'number') {
      return val >= 1000 || val <= -1000
        ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : val.toFixed(2);
    }
    return String(val);
  };

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-indicator-col">Indicator</th>
            {stocks.map((stock) => (
              <th key={stock.symbol}>{stock.symbol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indicators.map((ind) => (
            <tr key={ind}>
              <td className="compare-indicator-col">{ind}</td>
              {stocks.map((stock) => (
                <td key={`${stock.symbol}-${ind}`}>
                  {formatValue(stock[ind])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareTable;
