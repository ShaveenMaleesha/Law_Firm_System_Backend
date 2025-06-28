const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  daySummary: { type: String, required: true },
  nextStep: { type: String, required: true },
  nextDate: { type: Date, required: true },
  case_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
