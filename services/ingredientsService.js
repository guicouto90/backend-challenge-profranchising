const Joi = require('@hapi/joi');
const { ObjectId } = require("mongodb")
const { createIngredient, findIngredientById, findAllIngredients, updateIngredient } = require('../models/ingredientsModels');

const ingredientsSchema = Joi.object({
  name: Joi.string().required().not().empty(),
  unity: Joi.string().required().not().empty(),
  price: Joi.number().min(0.01).strict().required(),
});

const ingredientsSchemaEdit = Joi.object({
  name: Joi.string().not().empty(),
  unity: Joi.string().not().empty(),
  price: Joi.number().min(0.01).strict(),
});

const validateIngredients = (body) => {
  const { name, unity, price } = body;
  const { error } = ingredientsSchema.validate({ name, unity, price });

  if(error) throw error;

  if(unity !== 'kg' && unity !== 'l' && unity !== 'un') {
    const error1 = { status: 400, message: '"unity" must be filled with "kg"(kilograms), "l"(liter) or "un"(unity)'};
    throw error1;
  };
};

const validateIngredientsEdit = (body) => {
  const { name, unity, price } = body;
  const { error } = ingredientsSchemaEdit.validate({ name, unity, price });

  if(error) throw error;

  if(unity) {
    if(unity !== 'kg' && unity !== 'l' && unity !== 'un') {
      const error1 = { status: 400, message: '"unity" must be filled with "kg"(kilograms), "l"(liter) or "un"(unity)'};
      throw error1;
    };
  }
};

const newIngredient = async(name, unity, price) => {
  const ingredientId = await createIngredient(name, unity, price);
  const ingredient = {
    _id: ingredientId,
    name,
    unity,
    price
  };

  return ingredient;
};

const validateId = (id) => {
  const valid = ObjectId.isValid(id);

  if(valid === false) {
    const error = { status: 400, message: 'Ingredient Id is not valid' };
    throw error;
  };
};

const getAllIngredients = async() => {
  const ingredients = await findAllIngredients();

  return ingredients;
}

const getIngredientById = async(id) => {
  const ingredient = await findIngredientById(id);
  if(!ingredient) {
    const error = { status: 404, message: 'Ingredient not found' };
    throw error;
  };

  return ingredient;
};

const editIngredient = async(id, name, unity, price) => {
  await updateIngredient(id, name, unity, price);

  return { message: `Ingredient with id:${id} edited `};
}

module.exports = {
  validateIngredients,
  validateIngredientsEdit,
  newIngredient,
  validateId,
  getIngredientById,
  getAllIngredients,
  editIngredient,
}