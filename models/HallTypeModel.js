const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const hallTypeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
        },
        status: {
            type: String,
            enum: ["selected", "not_selected"],
            default: "not_selected",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HallType", hallTypeSchema);
