require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();
const notFound = require('./middleware/404');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const port = process.env.PORT || 3000;
const productRouter = require('./routes/products');
//middleware
app.use(express.json());


//routes

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1> <a href="/api/v1/products">/api/v1/products</a>');
});

app.use('/api/v1/products', productRouter);


app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        await app.listen(port, console.log(`Server started on port ${port}`));

    } catch (error) {
        console.log(error);
    }
}

start();