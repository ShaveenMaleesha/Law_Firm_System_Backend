const lawyerService = require("../services/lawyerService");

// Admin: Create lawyer
exports.createLawyer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      practiceArea,
      address,
      contactNo
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !practiceArea || !address || !contactNo) {
      return res.status(400).json({
        message: "Missing required fields: name, email, password, practiceArea, address, contactNo"
      });
    }

    // Check if email already exists
    const emailExists = await lawyerService.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email address."
      });
    }

    const lawyer = await lawyerService.createLawyer(req.body);
    
    // Remove password from response
    const { password: _, ...lawyerWithoutPassword } = lawyer.toObject();
    
    res.status(201).json({
      message: "Lawyer created successfully",
      lawyer: lawyerWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all lawyers with filtering and pagination
exports.getAllLawyers = async (req, res) => {
  try {
    const { 
      practiceArea, 
      email, 
      name, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filters = {};
    if (practiceArea) filters.practiceArea = practiceArea;
    if (email) filters.email = email;
    if (name) filters.name = name;

    const result = await lawyerService.getAllLawyers(filters, page, limit);
    
    res.json({
      message: "Lawyers retrieved successfully",
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get lawyer by ID with comprehensive details
exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await lawyerService.getLawyerById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get lawyer with statistics
exports.getLawyerWithStats = async (req, res) => {
  try {
    const lawyer = await lawyerService.getLawyerWithStats(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    res.json({
      message: "Lawyer details with statistics retrieved successfully",
      lawyer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get lawyers for selection dropdown (minimal info, no auth required)
exports.getLawyersForSelection = async (req, res) => {
  try {
    const lawyers = await lawyerService.getLawyersForSelection();
    res.json({
      message: "Lawyers for selection retrieved successfully",
      count: lawyers.length,
      lawyers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get lawyers by practice area
exports.getLawyersByPracticeArea = async (req, res) => {
  try {
    const { practiceArea } = req.params;
    const lawyers = await lawyerService.getLawyersByPracticeArea(practiceArea);
    
    res.json({
      message: `Lawyers in ${practiceArea} retrieved successfully`,
      count: lawyers.length,
      lawyers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update lawyer
exports.updateLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If email is being updated, check if it exists
    if (updateData.email) {
      const emailExists = await lawyerService.checkEmailExists(updateData.email, id);
      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists. Please use a different email address."
        });
      }
    }

    const updatedLawyer = await lawyerService.updateLawyer(id, updateData);
    
    if (!updatedLawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    
    res.json({
      message: "Lawyer updated successfully",
      lawyer: updatedLawyer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete lawyer
exports.deleteLawyer = async (req, res) => {
  try {
    const deletedLawyer = await lawyerService.deleteLawyer(req.params.id);
    
    if (!deletedLawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    
    res.json({ message: "Lawyer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get lawyer statistics
exports.getLawyerStatistics = async (req, res) => {
  try {
    const statistics = await lawyerService.getLawyerStatistics();
    
    res.json({
      message: "Lawyer statistics retrieved successfully",
      statistics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
