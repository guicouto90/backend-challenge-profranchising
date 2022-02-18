const express = require('express');
const { addIngredient, listAllIngredients, listIngredientById, updateIngredientById, deleteIngredientById } = require('../controllers/ingredientsController');
const ingredientsRouter = express.Router();

ingredientsRouter.post('/', addIngredient);

ingredientsRouter.get('/', listAllIngredients);

ingredientsRouter.get('/:id', listIngredientById);

ingredientsRouter.put('/:id', updateIngredientById);

ingredientsRouter.delete('/:id', deleteIngredientById);

module.exports = ingredientsRouter;