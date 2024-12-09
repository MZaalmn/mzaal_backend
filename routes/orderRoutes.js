const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create a new order
router.post("/", orderController.createOrder);

// Get all orders
router.get("/", orderController.getAllOrders);

// Get orders by user ID
router.get("/user/:userId", orderController.getOrdersByUser);

// Update order status
router.patch("/:orderId/status/:status", orderController.updateOrderStatus);

// Delete an order
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
