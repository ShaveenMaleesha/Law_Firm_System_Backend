const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
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
  shedual_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
});

module.exports = mongoose.model("Case", CaseSchema);
