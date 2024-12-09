require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const hallRoutes = require("./routes/hallRoutes");
const newsRoutes = require("./routes/newsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

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

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Optional: Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    },
});
const upload = multer({ storage: storage });

app.post("/create_job", upload.array("images", 3), async (req, res) => {
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
        console.log(zaalnii_bolomjuud);
        const images = req.files.map((file) => file.path);

        const newUser = new FormDataModel1({
            title,
            description,
            une,
            latitude,
            longitude,
            images,
            zaalnii_bolomjuud,
            email,
        });
        await newUser.save();

        res.status(201).json(newUser);
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

//---↓---↓--------↓--------↓---------↓---------↓-----Хэрэглэч ямар нэг зар харах----↓----------↓----↓---------↓-------↓--//
// Хэрэглэгч ямар нэг зар хархаар товч дарах үед тухайн ажлын ID-г авч өөр хуудас руу шилжинэ

app.get("/get_job/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log(jobId); //(ACTIVE)
        const jobInfo = await FormDataModel1.findById(jobId);
        if (!jobInfo) {
            return res.status(404).send("Олдсонгүй");
        }
        res.json([jobInfo]); // ARRAY болгоод буцаана
    } catch (err) {
        res.status(500).send(err);
    }
});
//----↑------↑-------↑--------↑-----↑-----↑----↑------Хэрэглэч ямар нэг зар харах------↑----------↑---------↑--------↑----//

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));