const Joi = require('@hapi/joi');
const { 
  createIngredient, 
  findIngredientById, 
  findAllIngredients, 
  updateIngredient, 
  deleteIngredient 
} = require('../models/ingredientsModels');
const validateId = require('../utils/validIdMongoDB');
const { verifyAdmin } = require('./usersServices');

const ingredientsSchema = Joi.object({
  name: Joi.string().required().not().empty(),
  unity: Joi.string().required().not().empty(),
  price: Joi.number().min(0.01).strict().required(),
});

const validateIngredients = (body) => {
  const { name, unity, price } = body;
  const { error } = ingredientsSchema.validate({ name, unity, price });

  if(error) throw error;

  if(unity !== 'kg' && unity !== 'l' && unity !== 'un') {
    const error1 = { status: 400, message: '"unity" must be filled with "kg"(kilograms), "l"(liter) or "un"(unity)'};
    throw error1;
  }
};

const newIngredient = async(body, user) => {
  const { name, unity, price } = body;
  validateIngredients(body);
  await verifyAdmin(user);
  const ingredientId = await createIngredient(name, unity, price);
  const ingredient = {
    _id: ingredientId,
    name,
    unity,
    price
  };

  return ingredient;
};

const getAllIngredients = async() => {
  const ingredients = await findAllIngredients();

  return ingredients;
}

const getIngredientById = async(id) => {
  validateId(id);
  const ingredient = await findIngredientById(id);
  if(!ingredient) {
    const error = { status: 404, message: 'Ingredient not found' };
    throw error;
  }

  return ingredient;
};

const editIngredient = async(id, user, body) => {
  const { name, unity, price } = body;

  validateId(id, 'Ingredient');
  await getIngredientById(id);
  await verifyAdmin(user);
  validateIngredients(body);

  await updateIngredient(id, name, unity, price);
  return { message: `Ingredient with id:${id} edited `};
}

const eraseIngredient = async(id, user) => {
  validateId(id, 'Ingredient');
  await getIngredientById(id);
  await verifyAdmin(user);

  await deleteIngredient(id);
  return { message: `Ingredient with id:${id} deleted `};
}

module.exports = {
  validateIngredients,
  newIngredient,
  getIngredientById,
  getAllIngredients,
  editIngredient,
  eraseIngredient,
}