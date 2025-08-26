const appointmentService = require("../services/appointmentService");

// Public API: Create appointment (no authentication required)
exports.createAppointment = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      client_id, // Optional - if user is authenticated
      subject,
      description,
      date,
      time
    } = req.body;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !subject || !description || !date || !time) {
      return res.status(400).json({
        message: "Missing required fields: clientName, clientEmail, clientPhone, subject, description, date, time"
      });
    }

    const appointmentData = {
      clientName,
      clientEmail,
      clientPhone,
      subject,
      description,
      date,
      time
    };

    // Add client_id if provided (for authenticated users)
    if (client_id) {
      appointmentData.client_id = client_id;
    }

    const appointment = await appointmentService.createAppointment(appointmentData);
    
    res.status(201).json({
      message: "Appointment request created successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments with filters and pagination
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, lawyer_id, client_id, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (lawyer_id) filters.lawyer_id = lawyer_id;
    if (client_id) filters.client_id = client_id;

    const result = await appointmentService.getAllAppointments(filters, page, limit);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending appointments (for admin)
exports.getPendingAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getPendingAppointments();
    res.json({
      message: "Pending appointments retrieved successfully",
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin API: Assign lawyer and approve appointment
exports.assignLawyerAndApprove = async (req, res) => {
  try {
    const { id } = req.params;
    const { lawyer_id, adminNotes } = req.body;
    const adminId = req.user.userId; // From auth middleware

    if (!lawyer_id) {
      return res.status(400).json({ message: "Lawyer ID is required" });
    }

    const appointment = await appointmentService.assignLawyerAndApprove(
      id,
      lawyer_id,
      adminId,
      adminNotes
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Lawyer assigned and appointment approved successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin API: Reject appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.userId; // From auth middleware

    const appointment = await appointmentService.rejectAppointment(
      id,
      adminId,
      adminNotes
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment rejected successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user?.userId; // From auth middleware (optional)

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const appointment = await appointmentService.updateAppointmentStatus(
      id,
      status,
      adminId,
      adminNotes
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment (general update)
exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await appointmentService.updateAppointment(
      req.params.id,
      req.body
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await appointmentService.deleteAppointment(req.params.id);
    
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointments by lawyer
exports.getAppointmentsByLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { status } = req.query;
    
    const appointments = await appointmentService.getAppointmentsByLawyer(lawyerId, status);
    
    res.json({
      message: "Lawyer appointments retrieved successfully",
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointments by client
exports.getAppointmentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status } = req.query;
    
    const appointments = await appointmentService.getAppointmentsByClient(clientId, status);
    
    res.json({
      message: "Client appointments retrieved successfully",
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
