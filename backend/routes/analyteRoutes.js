const express = require("express");
const router = express.Router();
const Analyte = require("../models/Analyte");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const { name, unit, level, mean, sd } = req.body;

    const analyteExists = await Analyte.findOne({ name, level });
    if (analyteExists) {
      return res.status(400).json({ message: "Analyte already exists" });
    }

    const analyte = await Analyte.create({
      name,
      unit,
      level,
      mean,
      sd,
      createdBy: req.user._id,
    });

    res.status(201).json(analyte);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const analytes = await Analyte.find().populate("createdBy", "name email");
    res.json(analytes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const analyte = await Analyte.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!analyte) {
      return res.status(404).json({ message: "Analyte not found" });
    }

    res.json(analyte);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
