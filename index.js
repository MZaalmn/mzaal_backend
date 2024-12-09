require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const router = express.Router();

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




app.get("/read_user_jobs", async (req, res) => {
    try {
        const userEmail = req.headers['user-email'];  // Get the email from the request headers
        if (!userEmail) {
            return res.status(400).json({ error: "Email is required" });
        }

        const job_infos = await FormDataModel1.find({ email: userEmail });  // Filter jobs based on the email
        res.send(job_infos);
    } catch (err) {
        res.status(500).send(err);
    }
});

  
  













//------------------------------------------------------------DELETE---------------------------------------
app.delete('/delete_job/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await FormDataModel1.findByIdAndDelete(id);
      res.status(200).send({ message: 'Job deleted successfully' });
    } catch (err) {
      res.status(500).send({ message: 'Error deleting job' });
    }
  });
//------------------------------------------------------------DELETE---------------------------------------





// Update Job by ID
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
        } = req.body;

        // Handle new images (if any)
        const images = req.files ? req.files.map((file) => file.path) : [];

        // Find the job by ID and update it
        const updatedJob = await FormDataModel1.findByIdAndUpdate(
            id,
            {
                title,
                description,
                une,
                latitude,
                longitude,
                images: images.length ? images : undefined, // Only update images if any
                zaalnii_bolomjuud,
                email,
            },
            { new: true } // This will return the updated document
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(updatedJob);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating job" });
    }
});




const mongoose = require("mongoose"); 
const buttonGridSchema = new mongoose.Schema({
    grid: Array,
});

const ButtonGrid = mongoose.model('ButtonGrid', buttonGridSchema);

// POST Route
app.post('/api/grid', async (req, res) => {
    try {
        const newGrid = new ButtonGrid({ grid: req.body.grid });
        await newGrid.save();
        res.status(201).json({ message: 'Grid saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// GET Route
app.get('/api/grid', async (req, res) => {
    try {
        const latestGrid = await ButtonGrid.findOne().sort({ _id: -1 }); // Retrieve the latest grid
        if (!latestGrid) {
            return res.status(404).json({ message: 'No grid data found' });
        }
        res.status(200).json(latestGrid);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  



module.exports = router;







const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));