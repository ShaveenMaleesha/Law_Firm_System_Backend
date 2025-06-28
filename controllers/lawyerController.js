const lawyerService = require("../services/lawyerService");

exports.createLawyer = async (req, res) => {
  try {
    const lawyer = await lawyerService.createLawyer(req.body);
    res.status(201).json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerService.getAllLawyers();
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await lawyerService.getLawyerById(req.params.id);
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLawyer = async (req, res) => {
  try {
    const updatedLawyer = await lawyerService.updateLawyer(
      req.params.id,
      req.body
    );
    if (!updatedLawyer)
      return res.status(404).json({ message: "Lawyer not found" });
    res.json(updatedLawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLawyer = async (req, res) => {
  try {
    const deletedLawyer = await lawyerService.deleteLawyer(req.params.id);
    if (!deletedLawyer)
      return res.status(404).json({ message: "Lawyer not found" });
    res.json({ message: "Lawyer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
