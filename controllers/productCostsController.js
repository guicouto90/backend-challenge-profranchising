const { getAllCosts } = require("../services/productsCostsService");

const listAllCosts = async(req, res, next) => {
  try {
    const result = await getAllCosts();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error)
  }
};

module.exports = {
  listAllCosts,
}