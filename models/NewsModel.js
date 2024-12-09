const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const newsSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        heroImage: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        published: {
            type: Boolean,
            default: false, // Мэдээ нийтлэгдсэн эсэх
        },
        publishedAt: {
            type: Date, // Нийтэлсэн огноо
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
