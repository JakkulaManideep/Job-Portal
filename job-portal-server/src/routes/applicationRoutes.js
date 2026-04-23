const express = require("express");
const { getMyApplications } = require("../controllers/applicationController");
const { requireAuthUser, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my/:email", requireAuthUser, requireRole("jobSeeker"), getMyApplications);

module.exports = router;