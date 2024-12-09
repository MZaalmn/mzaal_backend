// controllers/userController.js
const UserModel = require("../models/UserModel");
const User = require("../models/UserModel");

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password"); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
};

//GET by id
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        if (!user || user.role !== "user") {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, image } = req.body;

        if (role && !["user", "admin", "user", "guest"].includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (image) user.image = image;

        await user.save();

        return res.status(200).json({
            message: "User details updated successfully",
            user,
        });
    } catch (error) {
        console.error("Error editing user:", error);
        return res.status(500).json({ message: "Server error occurred." });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    editUser,
};
