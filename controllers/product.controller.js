const Product = require('../models/product.model');


async function getAllProducts(req, res, next) {
    try {
        const products = await Product.findAll();
        res.render('customers/products/all-products', { products: products });
    } catch (error) {
        next(error);
    }
}
async function getProductDetails(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        res.render('customers/products/product-detail', { product: product });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllProducts,
    getProductDetails

}