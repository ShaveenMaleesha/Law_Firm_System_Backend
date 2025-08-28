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

    // Validate practiceArea is an array
    if (!Array.isArray(practiceArea) || practiceArea.length === 0) {
      return res.status(400).json({
        message: "practiceArea must be a non-empty array of strings"
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

    // Validate practiceArea if provided
    if (updateData.practiceArea) {
      if (!Array.isArray(updateData.practiceArea) || updateData.practiceArea.length === 0) {
        return res.status(400).json({
          message: "practiceArea must be a non-empty array of strings"
        });
      }
    }

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

// Lawyer: Get current lawyer's own details
exports.getMyDetails = async (req, res) => {
  try {
    const lawyerId = req.user.userId;
    const lawyer = await lawyerService.getLawyerById(lawyerId, false);
    
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }
    
    res.json({
      message: "Lawyer details retrieved successfully",
      lawyer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lawyer: Update current lawyer's own details
exports.updateMyDetails = async (req, res) => {
  try {
    const lawyerId = req.user.userId;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated by lawyer themselves
    delete updateData.password; // Password updates should go through a separate endpoint
    delete updateData.role;
    delete updateData._id;
    delete updateData.blogIds;
    delete updateData.caseIds;
    
    // Validate practiceArea if provided
    if (updateData.practiceArea) {
      if (!Array.isArray(updateData.practiceArea) || updateData.practiceArea.length === 0) {
        return res.status(400).json({
          message: "practiceArea must be a non-empty array of strings"
        });
      }
    }
    
    // Validate profilePicture if provided (base64 image)
    if (updateData.profilePicture) {
      if (typeof updateData.profilePicture !== 'string') {
        return res.status(400).json({
          message: "profilePicture must be a base64 encoded string"
        });
      }
      
      // Check if it's a valid base64 image data URL
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Pattern.test(updateData.profilePicture)) {
        return res.status(400).json({
          message: "profilePicture must be a valid base64 image data URL (jpeg, jpg, png, gif, webp)"
        });
      }
      
      // Check base64 size (approximate check - base64 is ~1.33x original file size)
      const base64Data = updateData.profilePicture.split(',')[1];
      const sizeInBytes = (base64Data.length * 3) / 4;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      
      if (sizeInBytes > maxSizeInBytes) {
        return res.status(400).json({
          message: "Profile picture is too large. Maximum size is 5MB."
        });
      }
    }
    
    // Check if email is being updated and if it already exists
    if (updateData.email) {
      const emailExists = await lawyerService.checkEmailExists(updateData.email, lawyerId);
      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists. Please use a different email address."
        });
      }
    }
    
    const updatedLawyer = await lawyerService.updateLawyer(lawyerId, updateData);
    
    if (!updatedLawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    
    res.json({
      message: "Profile updated successfully",
      lawyer: updatedLawyer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
