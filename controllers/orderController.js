const Order = require("../models/OrdersModel");
const Hall = require("../models/HallModel");
const User = require("../models/UserModel");

// Create a new order
const createOrder = async (req, res) => {
    const { user, hall, startDate, endDate } = req.body;

    try {
        // Check if the user and hall exist
        const foundUser = await User.findById(user);
        const foundHall = await Hall.findById(hall);

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!foundHall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        // Create a new order
        const newOrder = new Order({
            user,
            hall,
            startDate,
            endDate,
            totalAmount: 0, // Initialize totalAmount
        });

        // Calculate and set the totalAmount
        await newOrder.calculateTotalAmount();

        // Save the new order
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error });
    }
};

// Get all orders for a user (Optional: you could also get for all users)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "hall",
                "title price location contactNumber facilities heroImage"
            ) // Populate hall details
            .populate("user", "username email role") // Optionally populate user details (if needed)
            .exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

// Get orders by a specific user
const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId }).populate(
            "hall",
            "title price location contactNumber facilities heroImage"
        );

        if (!orders || orders.length === 0) {
            return res
                .status(404)
                .json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user's orders:", error);
        res.status(500).json({
            message: "Error fetching user's orders",
            error,
        });
    }
};

// Update order status (e.g., pending, completed, canceled)
const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.params;

    if (!["pending", "completed", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status", error });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.remove();
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    updateOrderStatus,
    deleteOrder,
};
