const Joi = require('@hapi/joi');

const { findIngredientByName } = require('../models/ingredientsModels');
const { createProduct, findAllProducts, findProductById, updateProducts, deleteProduct, insertImage } = require('../models/productsModel');

const productSchema = Joi.object({
  name: Joi.string().required().not().empty(),
  price: Joi.number().min(0.01).required().strict(),
  quantity: Joi.number().min(1).required().strict(),
  ingredients: Joi.array().items(Joi.object({
    name: Joi.string().required().not().empty(),
    quantity: Joi.number().min(0.01).strict().required(),
  }).required()).required(),
});

const validateProducts = (body) => {
  const { name, price, quantity, ingredients } = body;
  const { error } = productSchema.validate({ name, price, quantity, ingredients });

  if(error) throw error;
};

const verifyIngredients = async(ingredients) => {
  await Promise.all(ingredients.map(async ({ name }) => {
    const result = await findIngredientByName(name);
    if(!result) {
      const error = { status: 404, message: `Ingredient with name ${name} not found`}
      throw error;
    }
  }))
};

const getProductById = async(id) => {
  const product = await findProductById(id);
  if(!product) {
    const error = { status: 404, message: 'Product not found' };
    throw error;
  }

  return product;
}

const newProduct = async(name, price, quantity, ingredients) => {
  const productId = await createProduct(name, price, quantity, ingredients);
  const product = {
    _id: productId,
    name,
    price,
    quantity,
    ingredients
  };

  return product;
};

const getAllProducts = async() => {
  const result = await findAllProducts();

  return result;
};

const editProduct = async(id, name, price, quantity, ingredients) => {
  await updateProducts(id, name, price, quantity, ingredients);

  return { message: `Product with id:${id} updated`}
}

const eraseProduct = async(id) => {
  await deleteProduct(id);

  return { message: `Product with id:${id} deleted`}
};

const newImage = async(id, host) => {
  const image = `${host}/uploads/${id}.jpeg`;
  const { _id, name, price, quantity, ingredients } = await findProductById(id);
  await insertImage(id, image);

  return { _id, name, price, quantity, ingredients, image };
};

module.exports = {
  newProduct,
  verifyIngredients,
  validateProducts,
  getAllProducts,
  getProductById,
  editProduct,
  eraseProduct,
  newImage
}