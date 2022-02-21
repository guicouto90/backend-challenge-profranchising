const express = require('express');
const { listAllUsers, addUser } = require('../controllers/usersController');
const usersRouter = express.Router();

usersRouter.get('/', listAllUsers);

usersRouter.post('/', addUser);

module.exports = usersRouter;