const {  
  newIngredient, 
  getAllIngredients, 
  getIngredientById, 
  editIngredient,
  eraseIngredient
} = require("../services/ingredientsService");

const listAllIngredients = async(req, res, next) => {
  try {
    const result = await getAllIngredients();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listIngredientById = async(req, res, next) => {
  try {
    const result = await getIngredientById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const addIngredient = async(req, res, next) => {
  try {
    const result = await newIngredient(req.body, req.user);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateIngredientById = async(req, res, next) => {
  try {
    const result = await editIngredient(req.params.id, req.user, req.body);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const deleteIngredientById = async(req, res, next) => {
  try {
    const result = await eraseIngredient(req.params.id, req.user);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

module.exports = {
  addIngredient,
  listAllIngredients,
  listIngredientById,
  updateIngredientById,
  deleteIngredientById
}