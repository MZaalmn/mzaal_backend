const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    mongoose
        .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 50000 })
        .then(() => {
            console.log("MongoDB connected successfully ✅");
        })
        .catch(() => {
            console.log("MongoDB connection failed ❌");
        });
};

module.exports = connectDB;
