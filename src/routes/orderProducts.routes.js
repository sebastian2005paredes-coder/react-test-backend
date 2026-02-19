const express = require("express");
const router = express.Router();

const orderProductsController = require("../controllers/orderProducts.controller");

router.post("/:id/items", orderProductsController.addItem);
router.put("/:id/items/:itemId", orderProductsController.updateItem);
router.delete("/:id/items/:itemId", orderProductsController.deleteItem);

module.exports = router;
