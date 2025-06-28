const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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
  case_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
