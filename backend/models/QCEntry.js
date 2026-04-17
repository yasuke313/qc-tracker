const mongoose = require("mongoose");

const qcEntrySchema = new mongoose.Schema(
  {
    analyte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analyte",
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    zScore: {
      type: Number,
    },
    flags: [
      {
        rule: {
          type: String,
        },
        severity: {
          type: String,
          enum: ["warning", "reject"],
        },
        message: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["in_control", "warning", "rejected"],
      default: "in_control",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("QCEntry", qcEntrySchema);
