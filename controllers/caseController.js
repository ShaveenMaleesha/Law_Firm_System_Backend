const caseService = require("../services/caseService");

exports.createCase = async (req, res) => {
  try {
    const caseData = await caseService.createCase(req.body);
    res.status(201).json(caseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const cases = await caseService.getAllCases();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await caseService.getCaseById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const updatedCase = await caseService.updateCase(req.params.id, req.body);
    if (!updatedCase)
      return res.status(404).json({ message: "Case not found" });
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await caseService.deleteCase(req.params.id);
    if (!deletedCase)
      return res.status(404).json({ message: "Case not found" });
    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
