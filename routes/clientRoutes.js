const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { auth, adminAuth } = require("../middleware/auth");

// Routes requiring authentication (for client selection in case management)
router.get("/selection", auth, clientController.getClientsForSelection);
router.get("/search", auth, adminAuth, clientController.searchClients);

// Admin routes - Client management
router.post("/", auth, adminAuth, clientController.createClient);
router.get("/", auth, adminAuth, clientController.getAllClients);
router.get("/statistics", auth, adminAuth, clientController.getClientStatistics);
router.get("/:id", auth, adminAuth, clientController.getClientById);
router.get("/:id/stats", auth, adminAuth, clientController.getClientWithStats);
router.put("/:id", auth, adminAuth, clientController.updateClient);
router.delete("/:id", auth, adminAuth, clientController.deleteClient);

module.exports = router;
