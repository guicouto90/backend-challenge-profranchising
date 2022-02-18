const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const ingredientsRouter = require('./routers/ingredientsRouter');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/ingredients', ingredientsRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`${PORT} working properly`))