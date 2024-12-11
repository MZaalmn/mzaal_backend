const express = require("express");
const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
