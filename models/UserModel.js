const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "owner", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.methods.isOwner = function () {
    return this.role === "owner";
};

module.exports = mongoose.model("User", userSchema);
