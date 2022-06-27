const Product = require('../models/product');
const getAllProducts = async(req, res) => {
    const { featured, name, sort, fields, numericFilters } = req.query;
    const queryObject = req.query;

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 1 }
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        const options = ['price', 'rating'];
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        filters = filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-');
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                };
            }

        });
        console.log(filters);
    }
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.limit(limit).skip(skip);



    const products = await result

    res.status(200).json({ nbHits: products.length, products });
}
const getAllProductsStatic = async(req, res) => {
    const products = await Product.find({ price: { $gt: 30, $lt: 50 } }).sort('price');
    res.status(200).json({ nbHits: products.length, products });
}

module.exports = { getAllProducts, getAllProductsStatic };