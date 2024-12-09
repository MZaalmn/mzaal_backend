// routes/userRoutes.js
const express = require("express");
const {
    getAllUsers,
    getUserById,
    editUser,
} = require("../controllers/userController");
const { authenticateAdmin } = require("../middleware/authMiddleWareAdmin");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/edit/:id", authenticateAdmin, editUser);

module.exports = router;
