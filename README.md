# StockVision

A full-stack stock market analysis and visualization platform built with React, Node.js, Express, MongoDB, and Python Flask.

## Features

- **Stock Search & Discovery** — Browse and search stocks with real-time pricing data
- **Interactive Charts** — Visualize stock price history with Chart.js line charts
- **Technical Indicators** — RSI, SMA, EMA, MACD, Bollinger Bands, volatility metrics
- **Buy/Hold/Sell Signals** — Analytical recommendations based on technical indicators
- **Stock Comparison** — Side-by-side comparison of 2-4 stocks
- **Watchlist** — Save and track your favorite stocks
- **Market Overview** — Major indices, top gainers, top losers, most active stocks
- **Responsive Design** — Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Chart.js + react-chartjs-2
- Axios
- Lucide React icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv, cors, axios

### Analytics Service
- Python 3.11+
- Flask
- pandas
- NumPy
- scikit-learn
- yfinance

## Architecture

```
React Frontend (port 5173)
    |
    v
Node.js Backend (port 5000)  <-->  MongoDB
    |
    v
Python Analytics (port 5001)
```

## Folder Structure

```
StockVision/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/            # Node.js + Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── analytics/          # Python Flask analytics
│   ├── services/
│   ├── app.py
│   └── requirements.txt
├── README.md
├── .gitignore
└── .env.example
```

## Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB running locally or a connection string

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs at `http://localhost:5000`

### Analytics Service
```bash
cd analytics
pip install -r requirements.txt
python app.py
```
Runs at `http://localhost:5001`

## Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/stockvision
PYTHON_ANALYTICS_URL=http://localhost:5001
STOCK_API_KEY=your_api_key_here
```

## API Endpoints

### Stocks
- `GET /api/stocks/:symbol` — Get stock info
- `GET /api/stocks/:symbol/history?period=1M` — Get price history
- `GET /api/stocks/search/:query` — Search stocks

### Watchlist
- `GET /api/watchlist` — Get watchlist
- `POST /api/watchlist` — Add to watchlist
- `DELETE /api/watchlist/:symbol` — Remove from watchlist

### Analysis
- `GET /api/analysis/:symbol` — Full analysis
- `GET /api/analysis/:symbol/indicators` — Technical indicators
- `GET /api/analysis/:symbol/signal` — Buy/Hold/Sell signal

### Compare
- `POST /api/compare` — Compare stocks (body: `{ "symbols": ["AAPL", "MSFT"] }`)

### Market
- `GET /api/market/overview` — Market overview

### Python Analytics
- `GET /api/analytics/:symbol` — Full analytics
- `GET /api/analytics/:symbol/indicators` — Indicators
- `GET /api/analytics/:symbol/signal` — Signal
- `POST /api/analytics/compare` — Compare stocks

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with market overview |
| `/stocks` | Stock search and listing |
| `/stock/:symbol` | Detailed stock analysis |
| `/watchlist` | Saved stocks |
| `/analysis` | Technical analysis page |
| `/compare` | Stock comparison |
| `/about` | About the project |

## Limitations

- Uses mock data when external APIs are unavailable
- Watchlist requires MongoDB to be running
- Real-time data depends on yfinance availability
- Not financial advice — educational purposes only

## Future Improvements

- User authentication with JWT
- Real-time WebSocket price updates
- More technical indicators (Ichimoku, Fibonacci)
- Portfolio tracking
- News integration
- Dark/light theme toggle
- Export analysis as PDF
- Mobile app with React Native

## License

MIT
