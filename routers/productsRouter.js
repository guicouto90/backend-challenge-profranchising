const express = require('express');
const { listAllProducts, addProduct, updateProductById, deleteProductById, listProductById, addImage } = require('../controllers/productsController');
const upload = require('../middlewares/upload');
const productsRouter = express.Router();

productsRouter.get('/', listAllProducts);

productsRouter.get('/:id', listProductById);

productsRouter.post('/', addProduct);

productsRouter.put('/:id', updateProductById);

productsRouter.put('/:id/image', upload.single('image'), addImage);

productsRouter.delete('/:id', deleteProductById);

module.exports = productsRouter;