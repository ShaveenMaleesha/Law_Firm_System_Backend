const express = require("express");
const router = express.Router();
const lawyerController = require("../controllers/lawyerController");

router.post("/", lawyerController.createLawyer);
router.get("/", lawyerController.getAllLawyers);
router.get("/:id", lawyerController.getLawyerById);
router.put("/:id", lawyerController.updateLawyer);
router.delete("/:id", lawyerController.deleteLawyer);

module.exports = router;
