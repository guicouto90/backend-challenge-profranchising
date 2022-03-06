const { newProduct, getAllProducts, editProduct, eraseProduct, getProductById, newImage } = require("../services/productsService");

const addProduct = async(req, res, next) => {
  try {
    const result = await newProduct(req.body, req.user);

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
    const result = await getProductById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const updateProductById = async(req, res, next) => {
  try {
    const result = await editProduct(req.params.id, req.user, req.body);
   
    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const deleteProductById = async(req, res, next) => {
  try {
    const result = await eraseProduct(req.params.id, req.user);

    return res.status(202).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const addImage = async(req, res, next) => {
  try {
    const result = await newImage(req.params.id, req.headers.host, req.user);

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