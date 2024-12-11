const Hall = require("../models/HallModel");

// Get all halls
const getAllHalls = async (req, res) => {
    try {
        const halls = await Hall.find().populate("type", "name icon status");
        res.status(200).json(halls);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching halls",
            error: error.message,
        });
    }
};

// Get a specific hall by ID
const getHallById = async (req, res) => {
    try {
        const { id } = req.params;
        const hall = await Hall.findById(id);

        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        res.status(200).json(hall);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching hall",
            error: error.message,
        });
    }
};

// Get halls owned by a specific owner
const getOwnerHalls = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const halls = await Hall.find({ owner: ownerId });

        if (!halls.length) {
            return res
                .status(404)
                .json({ message: "No halls found for this owner" });
        }

        res.status(200).json(halls);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching owner's halls",
            error: error.message,
        });
    }
};

// Create a new hall
const createHall = async (req, res) => {
    try {
        const newHall = new Hall(req.body);

        await newHall.save();
        res.status(201).json({
            message: "Hall created successfully",
            hall: newHall,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error creating hall",
            error: error.message,
        });
    }
};

// Update an existing hall
const updateHall = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHall = await Hall.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedHall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        res.status(200).json({
            message: "Hall updated successfully",
            hall: updatedHall,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating hall",
            error: error.message,
        });
    }
};

// Delete a hall
const deleteHall = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHall = await Hall.findByIdAndDelete(id);

        if (!deletedHall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        res.status(200).json({ message: "Hall deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting hall",
            error: error.message,
        });
    }
};

module.exports = {
    getAllHalls,
    getHallById,
    getOwnerHalls,
    createHall,
    updateHall,
    deleteHall,
};
