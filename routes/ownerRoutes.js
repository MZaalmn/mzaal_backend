// routes/ownerRoutes.js
const express = require("express");
const {
    getAllOwners,
    getOwnerById,
    addOwner,
    editOwner,
} = require("../controllers/ownerController");
const { authenticateAdmin } = require("../middleware/authMiddleWareAdmin");
const router = express.Router();

router.get("/", getAllOwners);
router.get("/:id", getOwnerById);
router.post("/add-owner", authenticateAdmin, addOwner);
router.put("/edit/:id", authenticateAdmin, editOwner);

module.exports = router;
