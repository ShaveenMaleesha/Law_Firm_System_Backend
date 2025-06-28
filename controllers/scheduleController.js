const scheduleService = require("../services/scheduleService");

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await scheduleService.updateSchedule(
      req.params.id,
      req.body
    );
    if (!updatedSchedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await scheduleService.deleteSchedule(req.params.id);
    if (!deletedSchedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
