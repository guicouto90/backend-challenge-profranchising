const express = require('express');
const { listAllCosts } = require('../controllers/productCostsController');
const { validateToken } = require('../middlewares/auth');
const productsCostsRouter = express.Router();

productsCostsRouter.get('/', validateToken, listAllCosts);

module.exports = productsCostsRouter