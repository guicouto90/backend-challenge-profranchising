const { findIngredientByName } = require("../models/ingredientsModels");
const { createCost, findAllCosts } = require("../models/productsCostModel");
const { findProductById } = require("../models/productsModel")

const calculateCost = async(id) => {
  const { ingredients, name } = await findProductById(id);
  let cost = 0;
  await Promise.all(ingredients.map(async({ name, quantity }) => {
    const { price } = await findIngredientByName(name);
    cost = ( quantity * price) + cost;
  }));
  const costId = await createCost(name, cost);
  return { _id: costId, name, cost};
};

const getAllCosts = async() => {
  const result = await findAllCosts();

  return result;
}

module.exports = {
  calculateCost,
  getAllCosts,
}