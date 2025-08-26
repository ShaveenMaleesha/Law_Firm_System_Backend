const clientService = require("../services/clientService");

// Admin: Create client
exports.createClient = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      email,
      contactNo,
      address
    } = req.body;

    // Validate required fields
    if (!name || !username || !password || !email || !contactNo || !address) {
      return res.status(400).json({
        message: "Missing required fields: name, username, password, email, contactNo, address"
      });
    }

    // Check if email already exists
    const emailExists = await clientService.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email address."
      });
    }

    // Check if username already exists
    const usernameExists = await clientService.checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({
        message: "Username already exists. Please use a different username."
      });
    }

    const client = await clientService.createClient(req.body);
    
    // Remove password from response
    const { password: _, ...clientWithoutPassword } = client.toObject();
    
    res.status(201).json({
      message: "Client created successfully",
      client: clientWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all clients with filtering and pagination
exports.getAllClients = async (req, res) => {
  try {
    const { 
      email, 
      name, 
      username, 
      contactNo, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filters = {};
    if (email) filters.email = email;
    if (name) filters.name = name;
    if (username) filters.username = username;
    if (contactNo) filters.contactNo = contactNo;

    const result = await clientService.getAllClients(filters, page, limit);
    
    res.json({
      message: "Clients retrieved successfully",
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get client by ID with comprehensive details
exports.getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get client with statistics
exports.getClientWithStats = async (req, res) => {
  try {
    const client = await clientService.getClientWithStats(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({
      message: "Client details with statistics retrieved successfully",
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get clients for selection dropdown (minimal info, authentication required)
exports.getClientsForSelection = async (req, res) => {
  try {
    const clients = await clientService.getClientsForSelection();
    res.json({
      message: "Clients for selection retrieved successfully",
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Search clients
exports.searchClients = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        message: "Search term must be at least 2 characters long"
      });
    }
    
    const clients = await clientService.searchClients(q.trim());
    
    res.json({
      message: "Client search completed successfully",
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If email is being updated, check if it exists
    if (updateData.email) {
      const emailExists = await clientService.checkEmailExists(updateData.email, id);
      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists. Please use a different email address."
        });
      }
    }

    // If username is being updated, check if it exists
    if (updateData.username) {
      const usernameExists = await clientService.checkUsernameExists(updateData.username, id);
      if (usernameExists) {
        return res.status(400).json({
          message: "Username already exists. Please use a different username."
        });
      }
    }

    const updatedClient = await clientService.updateClient(id, updateData);
    
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.json({
      message: "Client updated successfully",
      client: updatedClient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete client
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await clientService.deleteClient(req.params.id);
    
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get client statistics
exports.getClientStatistics = async (req, res) => {
  try {
    const statistics = await clientService.getClientStatistics();
    
    res.json({
      message: "Client statistics retrieved successfully",
      statistics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
