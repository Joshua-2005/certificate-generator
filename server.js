const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Certificate = require("./models/Certificate");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/save", async (req, res) => {
  try {
    const newCertificate = new Certificate(req.body);

    await newCertificate.save();

    res.json({
      success: true,
      message: "Certificate Saved",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find();

    res.json(certificates);
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/certificate/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.id,
    });

    if (certificate) {
      res.json({
        success: true,
        certificate,
      });
    } else {
      res.json({
        success: false,
        message: "Certificate Not Found",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});