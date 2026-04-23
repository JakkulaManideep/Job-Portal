const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicationsForJob,
} = require("../controllers/jobController");
const { requireAuthUser, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getAllJobs).post(requireAuthUser, requireRole("jobProvider"), createJob);
router.get("/my/:email", requireAuthUser, requireRole("jobProvider"), getMyJobs);
router.get("/:id", getJobById);
router.patch("/:id", requireAuthUser, requireRole("jobProvider"), updateJob);
router.delete("/:id", requireAuthUser, requireRole("jobProvider"), deleteJob);
router.post("/:id/apply", requireAuthUser, requireRole("jobSeeker"), applyToJob);
router.get("/:id/applications", requireAuthUser, requireRole("jobProvider"), getApplicationsForJob);

module.exports = router;