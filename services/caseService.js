const Case = require("../models/Case");

exports.createCase = async (caseData) => {
  return await Case.create(caseData);
};

exports.getAllCases = async () => {
  return await Case.find().populate(
    "client_id lawyer_id shedual_ids payments_ids"
  );
};

exports.getCaseById = async (id) => {
  return await Case.findById(id).populate(
    "client_id lawyer_id shedual_ids payments_ids"
  );
};

exports.updateCase = async (id, caseData) => {
  return await Case.findByIdAndUpdate(id, caseData, { new: true });
};

exports.deleteCase = async (id) => {
  return await Case.findByIdAndDelete(id);
};
