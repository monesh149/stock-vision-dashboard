const express = require('express');
const router = express.Router();
const { compareStocks } = require('../controllers/compareController');

router.post('/', compareStocks);

module.exports = router;
