const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        user: {
            type: String,
            ref: "User",
            required: true, // Reference to User model
        },
        hall: {
            type: String,
            ref: "Hall", // Reference to Hall model
            required: true, // Reference to Hall being ordered
        },
        startDate: {
            type: Date,
            required: true, // Start date for the hall booking
        },
        endDate: {
            type: Date,
            required: true, // End date for the hall booking
        },
        totalAmount: {
            type: Number,
            required: true, // Total amount for the booking
        },
        status: {
            type: String,
            enum: ["pending", "completed", "canceled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Calculate the totalAmount based on start and end dates
orderSchema.methods.calculateTotalAmount = function () {
    const duration = (this.endDate - this.startDate) / (1000 * 60 * 60); // Duration in hours
    this.totalAmount = duration * this.hall.perHour; // Total cost based on hall's hourly rate
    return this.totalAmount;
};

module.exports = mongoose.model("Order", orderSchema);
