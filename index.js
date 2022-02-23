const express = require('express');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const ingredientsRouter = require('./routers/ingredientsRouter');
const loginsRouter = require('./routers/loginsRouter');
const productsCostsRouter = require('./routers/productCostsRouter');
const productsRouter = require('./routers/productsRouter');
const usersRouter = require('./routers/usersRouter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send('<h2>WELCOME, PLEASE TRY ANOTHER ROUTE</h2>')
})

app.use('/ingredients', ingredientsRouter);

app.use('/products', productsRouter);

app.use('/users', usersRouter);

app.use('/login', loginsRouter);

app.use('/productscosts', productsCostsRouter);

app.use('/images', express.static(path.resolve(__dirname, '.', 'uploads')));

app.use(errorHandler);

app.listen(PORT, () => console.log(`${PORT} working properly`));

module.exports = app;