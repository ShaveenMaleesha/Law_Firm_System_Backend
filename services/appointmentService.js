const Appointment = require("../models/Appointment");

exports.createAppointment = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

exports.getAllAppointments = async () => {
  return await Appointment.find().populate("client_id lawyer_id");
};

exports.getAppointmentById = async (id) => {
  return await Appointment.findById(id).populate("client_id lawyer_id");
};

exports.updateAppointment = async (id, appointmentData) => {
  return await Appointment.findByIdAndUpdate(id, appointmentData, {
    new: true,
  });
};

exports.deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};
