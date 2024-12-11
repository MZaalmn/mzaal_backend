const express = require("express");
const {
    getAllHalls,
    getHallById,
    getOwnerHalls,
    createHall,
    updateHall,
    deleteHall,
} = require("../controllers/hallController");

const router = express.Router();

// GET all halls
router.get("/", getAllHalls);

// GET a specific hall by ID
router.get("/:id", getHallById);

// GET all halls by an owner
router.get("/owner/:ownerId", getOwnerHalls);

// POST a new hall
router.post("/", createHall);

// PUT to update a hall
router.put("/:id", updateHall);

// DELETE a hall
router.delete("/:id", deleteHall);

module.exports = router;
