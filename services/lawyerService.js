const Lawyer = require("../models/Lawyer");
const { hashPassword } = require("../utils/passwordUtils");

// Create lawyer
exports.createLawyer = async (lawyerData) => {
  if (lawyerData.password) {
    lawyerData.password = await hashPassword(lawyerData.password);
  }
  return await Lawyer.create(lawyerData);
};

// Admin: Get all lawyers with enhanced details and filtering
exports.getAllLawyers = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  if (filters.practiceArea) {
    query.practiceArea = { $in: [new RegExp(filters.practiceArea, 'i')] };
  }
  if (filters.email) {
    query.email = { $regex: filters.email, $options: 'i' };
  }
  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }
  
  // For admin, exclude password; for public view, exclude password and sensitive info
  const selectFields = filters.includePassword ? '' : '-password';
  
  const lawyers = await Lawyer.find(query)
    .select(selectFields)
    .populate('blogIds', 'topic approved timestamp')
    .populate('caseIds', 'caseName fileNumber status')
    .sort({ name: 1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Lawyer.countDocuments(query);
  
  return {
    lawyers,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Admin: Get lawyer by ID with comprehensive details
exports.getLawyerById = async (id, includePassword = false) => {
  const selectFields = includePassword ? '' : '-password';
  
  const lawyer = await Lawyer.findById(id)
    .select(selectFields)
    .populate('blogIds', 'topic content approved timestamp')
    .populate('caseIds', 'caseName fileNumber status client_id');
    
  if (!lawyer) return null;
  
  // Calculate lawyer statistics
  const totalCases = lawyer.caseIds.length;
  const successfulCases = lawyer.caseIds.filter(c => c.status === 'closed').length;
  const activeCases = lawyer.caseIds.filter(c => c.status === 'active').length;
  const pendingCases = lawyer.caseIds.filter(c => c.status === 'pending').length;
  const onHoldCases = lawyer.caseIds.filter(c => c.status === 'on-hold').length;
  
  // Get unique clients from cases
  const uniqueClientIds = [...new Set(lawyer.caseIds.map(c => c.client_id?.toString()).filter(Boolean))];
  const totalClients = uniqueClientIds.length;
  
  // Return lawyer data with statistics
  return {
    ...lawyer.toObject(),
    statistics: {
      totalCases,
      successfulCases, // cases with 'closed' status
      activeCases,
      pendingCases,
      onHoldCases,
      totalClients,
      totalBlogs: lawyer.blogIds.length,
      approvedBlogs: lawyer.blogIds.filter(b => b.approved).length
    }
  };
};

// Admin: Get lawyer with case statistics
exports.getLawyerWithStats = async (id) => {
  const lawyer = await Lawyer.findById(id)
    .select('-password')
    .populate('blogIds', 'topic approved timestamp')
    .populate('caseIds', 'caseName fileNumber status startDate endDate');
    
  if (!lawyer) return null;
  
  // Calculate statistics
  const totalCases = lawyer.caseIds.length;
  const activeCases = lawyer.caseIds.filter(c => c.status === 'active').length;
  const closedCases = lawyer.caseIds.filter(c => c.status === 'closed').length;
  const totalBlogs = lawyer.blogIds.length;
  const approvedBlogs = lawyer.blogIds.filter(b => b.approved).length;
  
  return {
    ...lawyer.toObject(),
    statistics: {
      totalCases,
      activeCases,
      closedCases,
      totalBlogs,
      approvedBlogs
    }
  };
};

// Get lawyers for dropdown/selection (minimal info)
exports.getLawyersForSelection = async () => {
  return await Lawyer.find()
    .select('name email practiceArea')
    .sort({ name: 1 });
};

// Get lawyers by practice area
exports.getLawyersByPracticeArea = async (practiceArea) => {
  return await Lawyer.find({ 
    practiceArea: { $in: [new RegExp(practiceArea, 'i')] } 
  }).select('-password');
};

// Update lawyer
exports.updateLawyer = async (id, lawyerData) => {
  if (lawyerData.password) {
    lawyerData.password = await hashPassword(lawyerData.password);
  }
  return await Lawyer.findByIdAndUpdate(id, lawyerData, { new: true })
    .select('-password');
};

// Delete lawyer
exports.deleteLawyer = async (id) => {
  return await Lawyer.findByIdAndDelete(id);
};

// Get lawyer statistics (for admin dashboard)
exports.getLawyerStatistics = async () => {
  const totalLawyers = await Lawyer.countDocuments();
  
  // Practice area distribution
  const practiceAreaStats = await Lawyer.aggregate([
    { $unwind: '$practiceArea' },
    {
      $group: {
        _id: '$practiceArea',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  return {
    total: totalLawyers,
    practiceAreaDistribution: practiceAreaStats
  };
};

// Check if email exists
exports.checkEmailExists = async (email, excludeId = null) => {
  const query = { email };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existingLawyer = await Lawyer.findOne(query);
  return !!existingLawyer;
};
