const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const UserModel = require("../models/UserModel");

const hallSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        perHour: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            urls: {
                type: [String],
                required: false,
            },
        },
        heroImage: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        facilities: {
            type: [String],
            required: true,
        },
        sale: {
            type: String,
            default: "",
        },
        owner: {
            type: String,
            ref: "User",
            required: true,
        },
        type: [
            {
                type: [String],
                ref: "HallType", // Reference to HallType model
                required: true,
            },
        ],
    },
    { timestamps: true }
);

// Ensure the owner doesn't have more than 5 halls
hallSchema.pre("save", async function (next) {
    try {
        const ownerHallsCount = await mongoose.model("Hall").countDocuments({
            owner: this.owner,
        });

        if (ownerHallsCount >= 5) {
            return next(new Error("Owner cannot have more than 5 halls"));
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Hall", hallSchema);
