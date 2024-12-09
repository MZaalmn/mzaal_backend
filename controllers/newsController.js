const NewsModel = require("../models/NewsModel");

// Create a news item
const createNews = async (req, res) => {
    try {
        const { title, description, heroImage, images, author, published } =
            req.body;

        const newsItem = new News({
            title,
            description,
            heroImage,
            images,
            author,
            published,
            publishedAt: published ? new Date() : null,
        });

        const savedNews = await newsItem.save();
        res.status(201).json({
            message: "News item created successfully",
            news: savedNews,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to create news item",
            details: error.message,
        });
    }
};

// Get all news
const getAllNews = async (req, res) => {
    try {
        const news = await NewsModel.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch news",
            details: error.message,
        });
    }
};

// Get a news item by ID
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const newsItem = await NewsModel.findById(id);

        if (!newsItem) {
            return res.status(404).json({ error: "News item not found" });
        }

        res.status(200).json(newsItem);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch news item",
            details: error.message,
        });
    }
};

// Update a news item by ID
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.published && !updates.publishedAt) {
            updates.publishedAt = new Date();
        } else if (!updates.published) {
            updates.publishedAt = null;
        }

        const updatedNews = await News.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!updatedNews) {
            return res.status(404).json({ error: "News item not found" });
        }

        res.status(200).json({
            message: "News item updated successfully",
            news: updatedNews,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update news item",
            details: error.message,
        });
    }
};

// Delete a news item by ID
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNews = await NewsModel.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ error: "News item not found" });
        }

        res.status(200).json({ message: "News item deleted successfully" });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete news item",
            details: error.message,
        });
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
};
