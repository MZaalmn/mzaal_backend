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

app.get("/read_jobs", async (req, res) => {
    try {
        const job_infos = await FormDataModel1.find({});
        res.send(job_infos);
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
