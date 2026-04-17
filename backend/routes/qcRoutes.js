const express = require("express");
const router = express.Router();
const QCEntry = require("../models/QCEntry");
const Analyte = require("../models/Analyte");
const { protect } = require("../middleware/authMiddleware");
const {
  calculateZScore,
  checkWestgardRules,
  determineStatus,
} = require("../utils/westgardEngine");

router.post("/", protect, async (req, res) => {
  try {
    const { analyteId, result, notes } = req.body;

    const analyte = await Analyte.findById(analyteId);
    if (!analyte) {
      return res.status(404).json({ message: "Analyte not found" });
    }

    const zScore = calculateZScore(result, analyte.mean, analyte.sd);

    const recentEntries = await QCEntry.find({ analyte: analyteId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("zScore");

    const prevZScores = recentEntries.map((entry) => entry.zScore);

    const flags = checkWestgardRules(zScore, prevZScores);
    const status = determineStatus(flags);

    const entry = await QCEntry.create({
      analyte: analyteId,
      result,
      operatorId: req.user._id,
      zScore,
      flags,
      status,
      notes,
    });

    await entry.populate("analyte", "name unit level mean sd");
    await entry.populate("operatorId", "name email");

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const { analyteId } = req.query;

    const query = {};
    if (analyteId) query.analyte = analyteId;

    const entries = await QCEntry.find(query)
      .sort({ createdAt: 1 })
      .populate("analyte", "name unit level mean sd")
      .populate("operatorId", "name email");

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
