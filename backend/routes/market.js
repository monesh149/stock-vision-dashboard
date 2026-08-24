const express = require('express');
const router = express.Router();
const { getMarketOverview } = require('../controllers/marketController');

router.get('/overview', getMarketOverview);

module.exports = router;
