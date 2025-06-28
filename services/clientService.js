const Client = require("../models/Client");

exports.createClient = async (clientData) => {
  return await Client.create(clientData);
};

exports.getAllClients = async () => {
  return await Client.find();
};

exports.getClientById = async (id) => {
  return await Client.findById(id);
};

exports.updateClient = async (id, clientData) => {
  return await Client.findByIdAndUpdate(id, clientData, { new: true });
};

exports.deleteClient = async (id) => {
  return await Client.findByIdAndDelete(id);
};
