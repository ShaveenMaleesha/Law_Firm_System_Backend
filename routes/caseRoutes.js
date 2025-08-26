const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const { auth, adminAuth } = require("../middleware/auth");

// Admin routes - Case management
router.post("/", auth, adminAuth, caseController.createCase);
router.get("/", auth, caseController.getAllCases);
router.get("/statistics", auth, adminAuth, caseController.getCaseStatistics);
router.get("/:id", auth, caseController.getCaseById);
router.put("/:id", auth, adminAuth, caseController.updateCase);
router.put("/:id/status", auth, adminAuth, caseController.updateCaseStatus);
router.delete("/:id", auth, adminAuth, caseController.deleteCase);

// User-specific routes
router.get("/lawyer/:lawyerId", auth, caseController.getCasesByLawyer);
router.get("/client/:clientId", auth, caseController.getCasesByClient);

module.exports = router;
