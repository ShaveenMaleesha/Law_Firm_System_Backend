const Appointment = require("../models/Appointment");

// Create appointment (public - no authentication required)
exports.createAppointment = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

// Get all appointments with pagination and filtering
exports.getAllAppointments = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.lawyer_id) query.lawyer_id = filters.lawyer_id;
  if (filters.client_id) query.client_id = filters.client_id;
  
  const appointments = await Appointment.find(query)
    .populate("client_id", "name email contactNo")
    .populate("lawyer_id", "name email practiceArea")
    .populate("assignedBy", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Appointment.countDocuments(query);
  
  return {
    appointments,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Get pending appointments (for admin review)
exports.getPendingAppointments = async () => {
  return await Appointment.find({ status: 'pending' })
    .populate("client_id", "name email contactNo")
    .populate("lawyer_id", "name email practiceArea")
    .sort({ createdAt: -1 });
};

// Get appointment by ID
exports.getAppointmentById = async (id) => {
  return await Appointment.findById(id)
    .populate("client_id", "name email contactNo")
    .populate("lawyer_id", "name email practiceArea")
    .populate("assignedBy", "username");
};

// Admin: Assign lawyer and approve appointment
exports.assignLawyerAndApprove = async (id, lawyerId, adminId, adminNotes = '') => {
  return await Appointment.findByIdAndUpdate(
    id,
    {
      lawyer_id: lawyerId,
      status: 'approved',
      assignedBy: adminId,
      adminNotes,
      updatedAt: new Date()
    },
    { new: true }
  ).populate("client_id lawyer_id assignedBy");
};

// Admin: Reject appointment
exports.rejectAppointment = async (id, adminId, adminNotes = '') => {
  return await Appointment.findByIdAndUpdate(
    id,
    {
      status: 'rejected',
      assignedBy: adminId,
      adminNotes,
      updatedAt: new Date()
    },
    { new: true }
  ).populate("client_id lawyer_id assignedBy");
};

// Update appointment status
exports.updateAppointmentStatus = async (id, status, adminId = null, adminNotes = '') => {
  const updateData = {
    status,
    updatedAt: new Date()
  };
  
  if (adminId) {
    updateData.assignedBy = adminId;
    updateData.adminNotes = adminNotes;
  }
  
  return await Appointment.findByIdAndUpdate(id, updateData, { new: true })
    .populate("client_id lawyer_id assignedBy");
};

// Update appointment (general update)
exports.updateAppointment = async (id, appointmentData) => {
  appointmentData.updatedAt = new Date();
  return await Appointment.findByIdAndUpdate(id, appointmentData, { new: true })
    .populate("client_id lawyer_id assignedBy");
};

// Delete appointment
exports.deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

// Get appointments by lawyer
exports.getAppointmentsByLawyer = async (lawyerId, status = null) => {
  const query = { lawyer_id: lawyerId };
  if (status) query.status = status;
  
  return await Appointment.find(query)
    .populate("client_id", "name email contactNo")
    .sort({ date: 1 });
};

// Get appointments by client
exports.getAppointmentsByClient = async (clientId, status = null) => {
  const query = { client_id: clientId };
  if (status) query.status = status;
  
  return await Appointment.find(query)
    .populate("lawyer_id", "name email practiceArea")
    .sort({ date: 1 });
};
