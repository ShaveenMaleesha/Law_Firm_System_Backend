const Client = require("../models/Client");
const { hashPassword } = require("../utils/passwordUtils");

// Create client
exports.createClient = async (clientData) => {
  if (clientData.password) {
    clientData.password = await hashPassword(clientData.password);
  }
  return await Client.create(clientData);
};

// Admin: Get all clients with enhanced details and filtering
exports.getAllClients = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  if (filters.email) {
    query.email = { $regex: filters.email, $options: 'i' };
  }
  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }
  if (filters.username) {
    query.username = { $regex: filters.username, $options: 'i' };
  }
  if (filters.contactNo) {
    query.contactNo = { $regex: filters.contactNo, $options: 'i' };
  }
  
  // Exclude password from results
  const clients = await Client.find(query)
    .select('-password')
    .sort({ name: 1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Client.countDocuments(query);
  
  return {
    clients,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Admin: Get client by ID with comprehensive details
exports.getClientById = async (id, includePassword = false) => {
  const selectFields = includePassword ? '' : '-password';
  
  return await Client.findById(id).select(selectFields);
};

// Admin: Get client with case statistics
exports.getClientWithStats = async (id) => {
  const Case = require("../models/Case");
  const Appointment = require("../models/Appointment");
  
  const client = await Client.findById(id).select('-password');
  
  if (!client) return null;
  
  // Get client's cases
  const cases = await Case.find({ client_id: id })
    .populate('lawyer_id', 'name practiceArea')
    .select('caseName fileNumber status startDate endDate');
  
  // Get client's appointments
  const appointments = await Appointment.find({ client_id: id })
    .populate('lawyer_id', 'name practiceArea')
    .select('subject date status createdAt');
  
  // Calculate statistics
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === 'active').length;
  const closedCases = cases.filter(c => c.status === 'closed').length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const approvedAppointments = appointments.filter(a => a.status === 'approved').length;
  
  return {
    ...client.toObject(),
    cases,
    appointments,
    statistics: {
      totalCases,
      activeCases,
      closedCases,
      totalAppointments,
      pendingAppointments,
      approvedAppointments
    }
  };
};

// Get clients for dropdown/selection (minimal info)
exports.getClientsForSelection = async () => {
  return await Client.find()
    .select('name email username contactNo')
    .sort({ name: 1 });
};

// Search clients by various criteria
exports.searchClients = async (searchTerm) => {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { username: { $regex: searchTerm, $options: 'i' } },
      { contactNo: { $regex: searchTerm, $options: 'i' } }
    ]
  };
  
  return await Client.find(query)
    .select('-password')
    .limit(10)
    .sort({ name: 1 });
};

// Update client
exports.updateClient = async (id, clientData) => {
  if (clientData.password) {
    clientData.password = await hashPassword(clientData.password);
  }
  return await Client.findByIdAndUpdate(id, clientData, { new: true })
    .select('-password');
};

// Delete client
exports.deleteClient = async (id) => {
  return await Client.findByIdAndDelete(id);
};

// Get client statistics (for admin dashboard)
exports.getClientStatistics = async () => {
  const totalClients = await Client.countDocuments();
  
  // Get registration trends (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
  const recentClients = await Client.countDocuments({
    createdAt: { $gte: twelveMonthsAgo }
  });
  
  // Monthly registration stats
  const monthlyStats = await Client.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  return {
    total: totalClients,
    recentClients,
    monthlyRegistrations: monthlyStats
  };
};

// Check if email exists
exports.checkEmailExists = async (email, excludeId = null) => {
  const query = { email };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existingClient = await Client.findOne(query);
  return !!existingClient;
};

// Check if username exists
exports.checkUsernameExists = async (username, excludeId = null) => {
  const query = { username };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existingClient = await Client.findOne(query);
  return !!existingClient;
};
