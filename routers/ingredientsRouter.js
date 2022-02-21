const express = require('express');
const { 
  addIngredient, 
  listAllIngredients, 
  listIngredientById, 
  updateIngredientById, 
  deleteIngredientById 
} = require('../controllers/ingredientsController');
const { validateToken } = require('../middlewares/auth');
const ingredientsRouter = express.Router();

ingredientsRouter.post('/', validateToken, addIngredient);

ingredientsRouter.get('/', validateToken, listAllIngredients);

ingredientsRouter.get('/:id', validateToken, listIngredientById);

ingredientsRouter.put('/:id', validateToken, updateIngredientById);

ingredientsRouter.delete('/:id', validateToken, deleteIngredientById);

module.exports = ingredientsRouter;