const UserModel = require("../models/UserModel");

//Бүх заал эзэмшигч
const getAllOwners = async (req, res) => {
    try {
        const owners = await UserModel.find({ role: "owner" }).select(
            "-password"
        );
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
};

//Заал эзэмшигчийг ID аар шүүж авах
const getOwnerById = async (req, res) => {
    const { id } = req.params;
    try {
        const owner = await UserModel.findById(id);
        if (!owner || owner.role !== "owner") {
            return res.status(404).json({ message: "Owner not found" });
        }
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch owner",
            error: error.message,
        });
    }
};

//Заал эзэмшигч нэмэх Хэрэглэгчдээс шүүж нэмэх

const addOwner = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "owner") {
            return res
                .status(400)
                .json({ message: "User is already an owner." });
        }

        user.role = "owner";
        await user.save();

        return res.status(200).json({
            message: "User successfully updated to owner role.",
            user,
        });
    } catch (error) {
        console.error("Error in addOwner:", error);
        return res.status(500).json({ message: "Server error occurred." });
    }
};

//Заал эзэмшигчийг ID аар шүүж авах Засвар хйих
const editOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, image } = req.body;

        if (role && !["owner", "admin", "user", "guest"].includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const owner = await UserModel.findById(id);

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        if (username) owner.username = username;
        if (email) owner.email = email;
        if (role) owner.role = role;
        if (image) owner.image = image;

        await owner.save();

        return res.status(200).json({
            message: "Owner details updated successfully",
            owner,
        });
    } catch (error) {
        console.error("Error editing owner:", error);
        return res.status(500).json({ message: "Server error occurred." });
    }
};

module.exports = {
    getAllOwners,
    getOwnerById,
    addOwner,
    editOwner,
};
