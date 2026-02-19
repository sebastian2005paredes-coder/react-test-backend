const service = require("../services/orderProducts.service");

exports.addItem = async (req, res) => {
    try {
        const result = await service.addItem(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const result = await service.updateItem(
            req.params.id,
            req.params.itemId,
            req.body.qty
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const result = await service.deleteItem(
            req.params.id,
            req.params.itemId
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

