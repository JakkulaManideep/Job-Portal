const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    value: { type: String, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, required: true },
    salaryType: {
      type: String,
      enum: ["Hourly", "Monthly", "Yearly"],
      required: true,
    },
    jobLocation: { type: String, required: true, trim: true },
    postingDate: { type: String, trim: true },
    experienceLevel: { type: String, required: true, trim: true },
    skills: { type: [skillSchema], default: [] },
    companyLogo: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Temporary"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    postedBy: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);