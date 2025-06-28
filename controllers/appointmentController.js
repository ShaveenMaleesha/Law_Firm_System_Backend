const appointmentService = require("../services/appointmentService");

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    const filteredAppointments = appointments.filter(
      (item) => item.approved === false
    );
    res.json(filteredAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await appointmentService.updateAppointment(
      req.params.id,
      req.body
    );
    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await appointmentService.deleteAppointment(
      req.params.id
    );
    if (!deletedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
