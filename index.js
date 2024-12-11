require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const router = express.Router();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const hallRoutes = require("./routes/hallRoutes");
const newsRoutes = require("./routes/newsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const hallTypeRoutes = require("./routes/hallTypeRoutes");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dz7nphcib",
    api_key: "375863575861284",
    api_secret: "5Kg25oAbK8J3vOsp3c7CX6kyFaE",
});

const FormDataModel1 = require("./models/TestModel");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/halls", hallRoutes);
app.use("/news", newsRoutes);
app.use("/orders", orderRoutes);
app.use("/owners", ownerRoutes);
app.use("/hallTypes", hallTypeRoutes);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage: storage });

app.post("/create_job", upload.array("images", 5), async (req, res) => {
    try {
        const {
            title,
            description,
            une,
            latitude,
            longitude,
            zaalnii_bolomjuud,
            email,
        } = req.body;

        const images = req.files.map((file) => file.path);

        const initialSchedule = [
            "2024-12-11-07:08 : available",
            "2024-12-11-08:09 : available",
            "2024-12-11-09:10 : available",
            "2024-12-11-10:11 : available",
            "2024-12-12-07:08 : available",
            "2024-12-12-08:09 : available",
            "2024-12-12-09:10 : available",
            "2024-12-12-10:11 : available",
        ];

        const newJob = new FormDataModel1({
            title,
            description,
            une,
            latitude,
            longitude,
            images,
            zaalnii_bolomjuud,
            email,
            schedule: initialSchedule,
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/read_jobs", async (req, res) => {
    try {
        const job_infos = await FormDataModel1.find({});
        res.send(job_infos);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/get_job/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        // console.log(jobId); //(ACTIVE)
        const jobInfo = await FormDataModel1.findById(jobId);
        if (!jobInfo) {
            return res.status(404).send("Олдсонгүй");
        }
        res.json([jobInfo]);
    } catch (err) {
        res.status(500).send(err);
    }
});
//----↑------↑-------↑--------↑-----↑-----↑----↑------Хэрэглэч ямар нэг зар харах------↑----------↑---------↑--------↑----//

app.get("/read_user_jobs", async (req, res) => {
    try {
        const userEmail = req.headers["user-email"]; // Get the email from the request headers
        if (!userEmail) {
            return res.status(400).json({ error: "Email is required" });
        }

        const job_infos = await FormDataModel1.find({ email: userEmail }); // Filter jobs based on the email
        res.send(job_infos);
    } catch (err) {
        res.status(500).send(err);
    }
});

//------------------------------------------------------------DELETE---------------------------------------
app.delete("/delete_job/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await FormDataModel1.findByIdAndDelete(id);
        res.status(200).send({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error deleting job" });
    }
});
//------------------------------------------------------------DELETE---------------------------------------

app.put("/update_job/:id", upload.array("images", 3), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            une,
            latitude,
            longitude,
            zaalnii_bolomjuud,
            email,
            schedule,
        } = req.body;

        const images = req.files ? req.files.map((file) => file.path) : [];

        const updatedJob = await FormDataModel1.findByIdAndUpdate(
            id,
            {
                title,
                description,
                une,
                latitude,
                longitude,
                images: images.length ? images : undefined,
                zaalnii_bolomjuud,
                email,
                schedule,
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(updatedJob);
    } catch (err) {
        res.status(500).json({ message: "Error updating job" });
    }
});

// Zahialga model
const ZahialgaSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormDataModel1",
        required: true,
    },
    userEmail: { type: String, required: true },
    times: [String],
    createdAt: { type: Date, default: Date.now },
});

const Zahialga = mongoose.model("Zahialga", ZahialgaSchema);

router.post("/api/zahialga", async (req, res) => {
    const { jobId, userEmail, times } = req.body;
    try {
        const newZahialga = new Zahialga({ jobId, userEmail, times });
        await newZahialga.save();
        res.status(201).json({ message: "Zahialga created successfully" });
    } catch (error) {
        console.error("Error creating Zahialga:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.use(router);

app.post("/api/update_schedule", async (req, res) => {
    const { jobId, selectedTimeSlots } = req.body;

    try {
        const job = await FormDataModel1.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const timesToTake = selectedTimeSlots.map(
            (slot) => slot.split(" : ")[0]
        );

        job.schedule = job.schedule.map((slot) => {
            const slotTime = slot.split(" : ")[0];
            if (timesToTake.includes(slotTime)) {
                return `${slotTime} : taken`;
            }
            return slot;
        });

        await job.save();

        res.status(200).json({ message: "Schedule updated successfully" });
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const purchaseSchema = new mongoose.Schema({
    zaal_id: String,
    userEmail: String,
    selectedDates: [String],
    totalPrice: Number,
    purchaseTime: String,
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

app.post("/api/purchase", async (req, res) => {
    const { zaal_id, userEmail, selectedDates, totalPrice, purchaseTime } =
        req.body;

    try {
        const newOrder = {
            zaal_id,
            userEmail,
            selectedDates,
            totalPrice,
            purchaseTime,
        };

        await Purchase.create(newOrder); // Replace `YourMongoModel` with your Mongoose model
        res.status(200).json({ message: "Order successfully saved!" });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ message: "Failed to save the order." });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
