const express = require("express");
const router = express.Router();
const lawyerController = require("../controllers/lawyerController");
const { auth, adminAuth } = require("../middleware/auth");

// Public routes (for lawyer selection in appointments, etc.)
router.get("/selection", lawyerController.getLawyersForSelection);
router.get("/practice-area/:practiceArea", lawyerController.getLawyersByPracticeArea);

// Admin routes - Lawyer management
router.post("/", auth, adminAuth, lawyerController.createLawyer);
router.get("/", auth, adminAuth, lawyerController.getAllLawyers);
router.get("/statistics", auth, adminAuth, lawyerController.getLawyerStatistics);
router.get("/:id", auth, adminAuth, lawyerController.getLawyerById);
router.get("/:id/stats", auth, adminAuth, lawyerController.getLawyerWithStats);
router.put("/:id", auth, adminAuth, lawyerController.updateLawyer);
router.delete("/:id", auth, adminAuth, lawyerController.deleteLawyer);

module.exports = router; 
