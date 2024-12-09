const express = require("express");
const {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
} = require("../controllers/newsController");

const router = express.Router();

// Create a news item
router.post("/", createNews);
// Get all news
router.get("/", getAllNews);
// Get a news item by ID
router.get("/:id", getNewsById);
// Update a news item by ID
router.put("/:id", updateNews);
// Delete a news item by ID
router.delete("/:id", deleteNews);

module.exports = router;
