const Schedule = require("../models/Schedule");

exports.createSchedule = async (scheduleData) => {
  return await Schedule.create(scheduleData);
};

exports.getAllSchedules = async () => {
  return await Schedule.find();
};

exports.getScheduleById = async (id) => {
  return await Schedule.findById(id);
};

exports.updateSchedule = async (id, updateData) => {
  return await Schedule.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteSchedule = async (id) => {
  return await Schedule.findByIdAndDelete(id);
};
