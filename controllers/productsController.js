const { validateProducts, verifyIngredients, newProduct, getAllProducts, editProduct, eraseProduct, getProductById, newImage } = require("../services/productsService");
const validateId = require("../utils/validIdMongoDB");

const addProduct = async(req, res, next) => {
  try {
    const { name, price, ingredients} = req.body;
    validateProducts(req.body);
    await verifyIngredients(ingredients);

    const result = await newProduct(name, price, ingredients);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listAllProducts = async(req, res, next) => {
  try {
    const result = await getAllProducts();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const listProductById = async(req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id, 'Product');
    const result = await getProductById(id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const updateProductById = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, ingredients } = req.body;
    console.log(req.headers.host)
    validateId(id, 'Product');
    await getProductById(id);
    validateProducts(req.body);
    await verifyIngredients(ingredients);

    const result = await editProduct(id, name, price, ingredients);
   
    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const addImage = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { host } = req.headers;
    console.log(req.file);
    validateId(id, 'Product');
    await getProductById(id);

    const result = await newImage(id, host);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const deleteProductById = async(req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id, 'Product');
    await getProductById(id);

    const result = await eraseProduct(id);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

module.exports = {
  listAllProducts,
  addProduct,
  updateProductById,
  deleteProductById,
  listProductById,
  addImage
}