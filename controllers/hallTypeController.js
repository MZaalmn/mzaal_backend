const HallTypeModel = require("../models/HallTypeModel");

const getHallTypes = async (req, res) => {
    try {
        const hallTypes = await HallTypeModel.find();
        res.status(200).json(hallTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHallTypesChecked = async (req, res) => {
    try {
        const hallTypes = await HallTypeModel.find({ status: "selected" });
        res.status(200).json(hallTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getHallTypeById = async (req, res) => {
    try {
        const hallType = await HallTypeModel.findById(req.params.id);
        if (!hallType) {
            return res.status(404).json({ message: "Hall type not found" });
        }
        res.status(200).json(hallType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createHallType = async (req, res) => {
    try {
        const { name, icon, status } = req.body;
        const hallType = new HallTypeModel({
            name,
            icon,
            status: status || "not_selected",
        });
        await hallType.save();
        res.status(201).json(hallType);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const deleteHallType = async (req, res) => {
    try {
        const hallType = await HallTypeModel.findByIdAndDelete(req.params.id);
        if (!hallType) {
            return res.status(404).json({ message: "Hall type not found" });
        }
        res.status(200).json({ message: "Hall type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateHallType = async (req, res) => {
    const { id } = req.params;
    const { name, status, icon } = req.body;

    console.log("Updating HallType with ID:", id);
    console.log("Body:", req.body);

    try {
        // Check if the provided ID exists
        const hallTypeToUpdate = await HallTypeModel.findById(id);

        if (!hallTypeToUpdate) {
            console.log("No HallType found for the provided ID.");
            return res.status(404).json({ message: "Hall type not found" });
        }

        // Perform the update
        const updatedHallType = await HallTypeModel.findByIdAndUpdate(
            id,
            { name, status, icon },
            { new: true }
        );

        console.log("Successfully updated:", updatedHallType);

        res.status(200).json(updatedHallType);
    } catch (error) {
        console.error("Error in updating HallType:", error);
        res.status(500).json({ message: "Failed to update hall type", error });
    }
};

module.exports = {
    getHallTypes,
    getHallTypeById,
    createHallType,
    deleteHallType,
    getHallTypesChecked,
    updateHallType,
};
