const express = require('express');
const { addIngredient, listAllIngredients, listIngredientById, updateIngredientById } = require('../controllers/ingredientsController');
const ingredientsRouter = express.Router();

ingredientsRouter.post('/', addIngredient);

ingredientsRouter.get('/', listAllIngredients);

ingredientsRouter.get('/:id', listIngredientById);

ingredientsRouter.put('/:id', updateIngredientById);

module.exports = ingredientsRouter;