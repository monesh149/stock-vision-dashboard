require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const stocksRouter = require('./routes/stocks');
const watchlistRouter = require('./routes/watchlist');
const analysisRouter = require('./routes/analysis');
const compareRouter = require('./routes/compare');
const marketRouter = require('./routes/market');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/stocks', stocksRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/compare', compareRouter);
app.use('/api/market', marketRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`StockVision server running on port ${PORT}`);
});
