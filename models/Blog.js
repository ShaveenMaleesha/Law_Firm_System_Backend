const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  content: { type: String, required: true },
  topic: { type: String, required: true },
  practiceArea: { type: String, required: true },
  approved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Blog", BlogSchema);
