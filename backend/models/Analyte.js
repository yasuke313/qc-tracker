const mongoose = require("mongoose");

const analyteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["low", "normal", "high"],
      required: true,
    },
    mean: {
      type: Number,
      required: true,
    },
    sd: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analyte", analyteSchema);
