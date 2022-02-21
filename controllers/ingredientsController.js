const { 
  validateIngredients, 
  newIngredient, 
  getAllIngredients, 
  getIngredientById, 
  editIngredient,
  eraseIngredient
} = require("../services/ingredientsService");
const { verifyAdmin } = require("../services/usersServices");
const validateId = require("../utils/validIdMongoDB");

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
    const { id } = req.params;
    validateId(id);
    const result = await getIngredientById(id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const addIngredient = async(req, res, next) => {
  try {
    const { name, unity, price } = req.body;
    validateIngredients(req.body);
    const result = await newIngredient(name, unity, price);
    const { user } = req;
    await verifyAdmin(user)

    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateIngredientById = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { name, unity, price } = req.body;
    validateId(id, 'Ingredient')
    await getIngredientById(id);
    const { user } = req;
    await verifyAdmin(user)

    validateIngredients(req.body);

    const result = await editIngredient(id, name, unity, price);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const deleteIngredientById = async(req, res, next) => {
  try {
    const { id } = req.params;

    validateId(id, 'Ingredient');
    await getIngredientById(id);
    const { user } = req;
    await verifyAdmin(user)

    const result = await eraseIngredient(id);

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