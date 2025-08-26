const caseService = require("../services/caseService");

// Admin: Create a new case
exports.createCase = async (req, res) => {
  try {
    const {
      caseName,
      fileNumber,
      client_id,
      lawyer_id,
      description,
      caseType,
      priority,
      startDate
    } = req.body;

    // Validate required fields
    if (!caseName || !fileNumber || !client_id || !lawyer_id) {
      return res.status(400).json({
        message: "Missing required fields: caseName, fileNumber, client_id, lawyer_id"
      });
    }

    // Check if file number already exists
    const fileExists = await caseService.checkFileNumberExists(fileNumber);
    if (fileExists) {
      return res.status(400).json({
        message: "File number already exists. Please use a unique file number."
      });
    }

    // Get admin ID from auth middleware
    const adminId = req.user.userId;

    const caseData = {
      caseName,
      fileNumber,
      client_id,
      lawyer_id,
      description,
      caseType,
      priority: priority || 'medium',
      startDate: startDate || new Date(),
      createdBy: adminId
    };

    const newCase = await caseService.createCase(caseData);
    
    // Populate the created case for response
    const populatedCase = await caseService.getCaseById(newCase._id);

    res.status(201).json({
      message: "Case created successfully",
      case: populatedCase
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all cases with filtering and pagination
exports.getAllCases = async (req, res) => {
  try {
    const { 
      status, 
      lawyer_id, 
      client_id, 
      priority, 
      caseType, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (lawyer_id) filters.lawyer_id = lawyer_id;
    if (client_id) filters.client_id = client_id;
    if (priority) filters.priority = priority;
    if (caseType) filters.caseType = caseType;

    const result = await caseService.getAllCases(filters, page, limit);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get case by ID
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await caseService.getCaseById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update case
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If file number is being updated, check if it exists
    if (updateData.fileNumber) {
      const currentCase = await caseService.getCaseById(id);
      if (currentCase && currentCase.fileNumber !== updateData.fileNumber) {
        const fileExists = await caseService.checkFileNumberExists(updateData.fileNumber);
        if (fileExists) {
          return res.status(400).json({
            message: "File number already exists. Please use a unique file number."
          });
        }
      }
    }

    const updatedCase = await caseService.updateCase(id, updateData);
    
    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }
    
    res.json({
      message: "Case updated successfully",
      case: updatedCase
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete case (Admin only)
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await caseService.deleteCase(req.params.id);
    
    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }
    
    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cases by lawyer
exports.getCasesByLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { status } = req.query;
    
    const cases = await caseService.getCasesByLawyer(lawyerId, status);
    
    res.json({
      message: "Lawyer cases retrieved successfully",
      count: cases.length,
      cases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cases by client
exports.getCasesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status } = req.query;
    
    const cases = await caseService.getCasesByClient(clientId, status);
    
    res.json({
      message: "Client cases retrieved successfully",
      count: cases.length,
      cases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update case status
exports.updateCaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user?.userId;

    const validStatuses = ['active', 'closed', 'pending', 'on-hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updatedCase = await caseService.updateCaseStatus(id, status, adminId);
    
    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }
    
    res.json({
      message: "Case status updated successfully",
      case: updatedCase
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get case statistics (Admin dashboard)
exports.getCaseStatistics = async (req, res) => {
  try {
    const statistics = await caseService.getCaseStatistics();
    
    res.json({
      message: "Case statistics retrieved successfully",
      statistics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
