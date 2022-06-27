require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./data/products.json');

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.create(jsonProducts);
        console.log('Products created');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
start();