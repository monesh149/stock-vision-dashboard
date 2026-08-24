const express = require('express');
const router = express.Router();
const { getAnalysis, getIndicators, getSignal } = require('../controllers/analysisController');

router.get('/:symbol/indicators', getIndicators);
router.get('/:symbol/signal', getSignal);
router.get('/:symbol', getAnalysis);

module.exports = router;
