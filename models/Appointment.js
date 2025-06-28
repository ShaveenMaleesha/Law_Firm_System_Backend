const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  lawyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  approved: { type: Boolean, default: false },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
