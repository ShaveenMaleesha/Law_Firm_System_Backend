const Lawyer = require("../models/Lawyer");

exports.createLawyer = async (lawyerData) => {
  return await Lawyer.create(lawyerData);
};

exports.getAllLawyers = async () => {
  return await Lawyer.find();
};

exports.getLawyerById = async (id) => {
  return await Lawyer.findById(id);
};

exports.updateLawyer = async (id, lawyerData) => {
  return await Lawyer.findByIdAndUpdate(id, lawyerData, { new: true });
};

exports.deleteLawyer = async (id) => {
  return await Lawyer.findByIdAndDelete(id);
};
