const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    resumeLink: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "shortlisted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicantEmail: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);