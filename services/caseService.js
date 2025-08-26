const Case = require("../models/Case");

// Admin: Create a new case
exports.createCase = async (caseData) => {
  return await Case.create(caseData);
};

// Get all cases with population and filtering
exports.getAllCases = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.lawyer_id) query.lawyer_id = filters.lawyer_id;
  if (filters.client_id) query.client_id = filters.client_id;
  if (filters.priority) query.priority = filters.priority;
  if (filters.caseType) query.caseType = { $regex: filters.caseType, $options: 'i' };
  
  const cases = await Case.find(query)
    .populate("client_id", "name email contactNo username")
    .populate("lawyer_id", "name email practiceArea contactNo")
    .populate("createdBy", "username")
    .populate("shedual_ids")
    .populate("payments")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Case.countDocuments(query);
  
  return {
    cases,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Get case by ID with full population
exports.getCaseById = async (id) => {
  return await Case.findById(id)
    .populate("client_id", "name email contactNo username address")
    .populate("lawyer_id", "name email practiceArea contactNo address")
    .populate("createdBy", "username")
    .populate("shedual_ids")
    .populate("payments");
};

// Update case
exports.updateCase = async (id, caseData) => {
  caseData.updatedAt = new Date();
  return await Case.findByIdAndUpdate(id, caseData, { new: true })
    .populate("client_id lawyer_id createdBy shedual_ids payments");
};

// Delete case
exports.deleteCase = async (id) => {
  return await Case.findByIdAndDelete(id);
};

// Get cases by lawyer
exports.getCasesByLawyer = async (lawyerId, status = null) => {
  const query = { lawyer_id: lawyerId };
  if (status) query.status = status;
  
  return await Case.find(query)
    .populate("client_id", "name email contactNo")
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
};

// Get cases by client
exports.getCasesByClient = async (clientId, status = null) => {
  const query = { client_id: clientId };
  if (status) query.status = status;
  
  return await Case.find(query)
    .populate("lawyer_id", "name email practiceArea")
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
};

// Update case status
exports.updateCaseStatus = async (id, status, adminId = null) => {
  const updateData = { status, updatedAt: new Date() };
  
  return await Case.findByIdAndUpdate(id, updateData, { new: true })
    .populate("client_id lawyer_id createdBy");
};

// Get case statistics
exports.getCaseStatistics = async () => {
  const totalCases = await Case.countDocuments();
  const activeCases = await Case.countDocuments({ status: 'active' });
  const closedCases = await Case.countDocuments({ status: 'closed' });
  const pendingCases = await Case.countDocuments({ status: 'pending' });
  const onHoldCases = await Case.countDocuments({ status: 'on-hold' });
  
  const priorityStats = await Case.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    total: totalCases,
    active: activeCases,
    closed: closedCases,
    pending: pendingCases,
    onHold: onHoldCases,
    priorityBreakdown: priorityStats
  };
};

// Check if file number exists
exports.checkFileNumberExists = async (fileNumber) => {
  const existingCase = await Case.findOne({ fileNumber });
  return !!existingCase;
};
