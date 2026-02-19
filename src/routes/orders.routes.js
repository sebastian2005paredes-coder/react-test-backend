const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/orders.controller");

router.get("/", ordersController.getOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);
router.patch("/:id/status", ordersController.updateOrderStatus);

module.exports = router;
