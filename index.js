const express = require('express');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const ingredientsRouter = require('./routers/ingredientsRouter');
const productsRouter = require('./routers/productsRouter');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/ingredients', ingredientsRouter);

app.use('/products', productsRouter);

app.use('/images', express.static(path.resolve(__dirname, '.', 'uploads')));

app.use(errorHandler);

app.listen(PORT, () => console.log(`${PORT} working properly`))