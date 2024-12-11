const express = require("express");
const {
    getHallTypes,
    getHallTypeById,
    createHallType,
    deleteHallType,
    getHallTypesChecked,
    updateHallType,
} = require("../controllers/hallTypeController");

const router = express.Router();

router.get("/", getHallTypes); // Get all hall types
router.get("/checked", getHallTypesChecked); // Get all hall types
router.get("/:id", getHallTypeById); // Get a single hall type by ID
router.post("/", createHallType); // Create a new hall type
router.delete("/:id", deleteHallType); // Delete a hall type
router.put("/:id", updateHallType);

module.exports = router;
