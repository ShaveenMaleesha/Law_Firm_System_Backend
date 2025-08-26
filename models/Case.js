const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  caseName: { type: String, required: true },
  fileNumber: { type: String, required: true, unique: true },
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
  description: { type: String },
  status: { 
    type: String,  
    enum: ['active', 'closed', 'pending', 'on-hold'], 
    default: 'active' 
  },
  caseType: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  shedual_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Case", CaseSchema);
