const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  practiceArea: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  caseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
});

module.exports = mongoose.model("Lawyer", LawyerSchema);
