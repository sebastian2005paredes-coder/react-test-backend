const productsService = require("../services/products.service");

exports.getProducts = async (req, res) => {
    try {
        const products = await productsService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productsService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const result = await productsService.createProduct(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const result = await productsService.updateProduct(
            req.params.id,
            req.body
        );

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await productsService.deleteProduct(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
