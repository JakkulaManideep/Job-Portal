const Job = require("../models/Job");
const Application = require("../models/Application");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const requiredFields = [
  "jobTitle",
  "companyName",
  "maxPrice",
  "salaryType",
  "jobLocation",
  "experienceLevel",
  "employmentType",
  "description",
  "postedBy",
];

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return { value: skill, label: skill };
      }

      if (skill && typeof skill === "object") {
        const value = String(skill.value || skill.label || "").trim();
        const label = String(skill.label || skill.value || "").trim();

        if (!value && !label) return null;
        return { value: value || label, label: label || value };
      }

      return null;
    })
    .filter(Boolean);
};

const normalizePayload = (body) => ({
  ...body,
  minPrice: Number(body.minPrice || 0),
  maxPrice: Number(body.maxPrice),
  postedBy: String(body.postedBy || "").toLowerCase().trim(),
  skills: normalizeSkills(body.skills),
});

const validateRequired = (body) => {
  const missing = requiredFields.filter((field) => !String(body[field] ?? "").trim());

  if (missing.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
  }

  if (Number.isNaN(body.maxPrice) || Number.isNaN(body.minPrice)) {
    throw new ApiError(400, "Salary values must be numbers");
  }
};

const ensureProviderOwnsJob = (job, req) => {
  const ownerEmail = String(job.postedBy || "").toLowerCase().trim();
  const currentEmail = String(req.authUser?.email || "").toLowerCase().trim();

  if (!ownerEmail || ownerEmail !== currentEmail) {
    throw new ApiError(403, "You can only modify your own jobs");
  }
};

const createJob = asyncHandler(async (req, res) => {
  const payload = normalizePayload({ ...req.body, postedBy: req.authUser.email });
  validateRequired(payload);

  const job = await Job.create(payload);
  res.status(201).json(job);
});

const getAllJobs = asyncHandler(async (req, res) => {
  const { q = "", postedBy } = req.query;

  const filter = {};

  if (postedBy) {
    filter.postedBy = String(postedBy).toLowerCase().trim();
  }

  if (q) {
    filter.jobTitle = { $regex: String(q).trim(), $options: "i" };
  }

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.json(job);
});

const getMyJobs = asyncHandler(async (req, res) => {
  const email = String(req.params.email || "").toLowerCase().trim();
  const currentEmail = String(req.authUser?.email || "").toLowerCase().trim();

  if (email !== currentEmail) {
    throw new ApiError(403, "You can only access your own jobs");
  }

  const jobs = await Job.find({ postedBy: email }).sort({ createdAt: -1 });
  res.json(jobs);
});

const updateJob = asyncHandler(async (req, res) => {
  const existingJob = await Job.findById(req.params.id);

  if (!existingJob) {
    throw new ApiError(404, "Job not found");
  }

  ensureProviderOwnsJob(existingJob, req);

  const payload = normalizePayload({ ...req.body, postedBy: req.authUser.email });
  validateRequired(payload);

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  res.json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  const deletedJob = await Job.findById(req.params.id);

  if (!deletedJob) {
    throw new ApiError(404, "Job not found");
  }

  ensureProviderOwnsJob(deletedJob, req);

  await Job.findByIdAndDelete(req.params.id);
  await Application.deleteMany({ job: deletedJob._id });

  res.json({ message: "Job deleted successfully" });
});

const applyToJob = asyncHandler(async (req, res) => {
  const { resumeLink, coverLetter = "" } = req.body;
  const applicantEmail = String(req.authUser?.email || "").toLowerCase().trim();

  if (!resumeLink) {
    throw new ApiError(400, "resumeLink is required");
  }

  if (!applicantEmail) {
    throw new ApiError(400, "Unable to resolve authenticated user email");
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const application = await Application.create({
    job: job._id,
    applicantEmail,
    resumeLink: String(resumeLink).trim(),
    coverLetter: String(coverLetter).trim(),
  });

  res.status(201).json({
    message: "Application submitted successfully",
    application,
  });
});

const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  ensureProviderOwnsJob(job, req);

  const applications = await Application.find({ job: req.params.id }).sort({ createdAt: -1 });
  res.json(applications);
});

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicationsForJob,
};