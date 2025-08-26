const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { auth, adminAuth } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/", appointmentController.createAppointment);

// General routes (authentication required)
router.get("/", auth, appointmentController.getAllAppointments);
router.get("/pending", auth, adminAuth, appointmentController.getPendingAppointments);
router.get("/:id", appointmentController.getAppointmentById);

// Admin routes (admin authentication required)
router.put("/:id/assign-lawyer", auth, adminAuth, appointmentController.assignLawyerAndApprove);
router.put("/:id/reject", auth, adminAuth, appointmentController.rejectAppointment);
router.put("/:id/status", auth, adminAuth, appointmentController.updateAppointmentStatus);
router.put("/:id", auth, appointmentController.updateAppointment);
router.delete("/:id", auth, adminAuth, appointmentController.deleteAppointment);

// User-specific routes
router.get("/lawyer/:lawyerId", auth, appointmentController.getAppointmentsByLawyer);
router.get("/client/:clientId", auth, appointmentController.getAppointmentsByClient);

module.exports = router;
