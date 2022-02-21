const express = require('express');
const { addLogin } = require('../controllers/loginsController');
const loginsRouter = express.Router();

loginsRouter.post('/', addLogin);

module.exports = loginsRouter;