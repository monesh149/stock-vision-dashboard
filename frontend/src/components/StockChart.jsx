import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ data = [], title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const labels = data.map((d) => {
    const date = new Date(d.date);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  });

  const prices = data.map((d) => d.price);

  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Price',
        data: prices,
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#ffffff',
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (item) => `₹${Number(item.raw).toFixed(2)}`,
        },
        backgroundColor: '#111111',
        titleColor: '#999999',
        bodyColor: '#ffffff',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: '#2a2a2a', drawBorder: false },
        ticks: { color: '#999999', maxRotation: 0, maxTicksLimit: 10 },
        border: { display: false },
      },
      y: {
        grid: { color: '#2a2a2a', drawBorder: false },
        ticks: {
          color: '#999999',
          callback: (val) => `₹${val}`,
        },
        border: { display: false },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="stock-chart">
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StockChart;
