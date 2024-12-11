const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        hall: {
            type: String,
            ref: "Hall",
            required: true,
        },
        user: {
            type: String,
            ref: "User",
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        timeSlots: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
