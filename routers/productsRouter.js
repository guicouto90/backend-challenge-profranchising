const express = require('express');
const { listAllProducts, addProduct, updateProductById, deleteProductById, listProductById, addImage } = require('../controllers/productsController');
const { validateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const productsRouter = express.Router();

productsRouter.get('/', validateToken, listAllProducts);

productsRouter.get('/:id', validateToken, listProductById);

productsRouter.post('/', validateToken, addProduct);

productsRouter.put('/:id', validateToken, updateProductById);

productsRouter.put('/:id/image', validateToken, upload.single('image'), addImage);

productsRouter.delete('/:id', validateToken, deleteProductById);

module.exports = productsRouter;