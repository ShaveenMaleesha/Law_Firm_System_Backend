const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  // For unauthenticated users
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  
  // For authenticated users (optional)
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: false,
  },
  
  // Lawyer assignment (done by admin)
  lawyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: false,
  },
  
  // Appointment details
  subject: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  
  // Status management
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  
  // Admin actions
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  adminNotes: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
