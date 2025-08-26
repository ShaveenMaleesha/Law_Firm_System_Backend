const Admin = require("../models/Admin");
const { hashPassword } = require("../utils/passwordUtils");

exports.createAdmin = async (adminData) => { 
  if (adminData.password) {
    adminData.password = await hashPassword(adminData.password);
  }
  return await Admin.create(adminData);
};

exports.getAllAdmins = async () => {
  return await Admin.find().select('-password');
};

exports.getAdminById = async (id) => {
  return await Admin.findById(id).select('-password');
};

exports.updateAdmin = async (id, adminData) => {
  if (adminData.password) {
    adminData.password = await hashPassword(adminData.password);
  }
  return await Admin.findByIdAndUpdate(id, adminData, { new: true }).select('-password');
};

exports.deleteAdmin = async (id) => {
  return await Admin.findByIdAndDelete(id);
};