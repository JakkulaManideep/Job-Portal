const Application = require("../models/Application");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const getMyApplications = asyncHandler(async (req, res) => {
  const email = String(req.params.email || "").toLowerCase().trim();
  const currentEmail = String(req.authUser?.email || "").toLowerCase().trim();

  if (email !== currentEmail) {
    throw new ApiError(403, "You can only access your own applications");
  }

  const applications = await Application.find({ applicantEmail: email })
    .populate("job")
    .sort({ createdAt: -1 });

  res.json(applications);
});

module.exports = {
  getMyApplications,
};