const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Lawyer = require('../models/Lawyer');

// Generate JWT Token
const generateToken = (userId, role, username, email) => {
  return jwt.sign(
    { userId, role, username, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();

    // Generate token
  const token = generateToken(admin._id, 'admin', admin.username, admin.email || null);

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
  const token = generateToken(admin._id, 'admin', admin.username, admin.email || null);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client Registration
exports.registerClient = async (req, res) => {
  try {
    const { name, username, password, email, contactNo, address } = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create client
    const client = new Client({
      name,
      username,
      password: hashedPassword,
      email,
      contactNo,
      address
    });

    await client.save();

    // Generate token
  const token = generateToken(client._id, 'client', client.username, client.email);

    res.status(201).json({
      message: 'Client registered successfully',
      token,
      user: {
        id: client._id,
        name: client.name,
        username: client.username,
        email: client.email,
        role: 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client Login
exports.loginClient = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if client exists
    const client = await Client.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    if (!client) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
  const token = generateToken(client._id, 'client', client.username, client.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: client._id,
        name: client.name,
        username: client.username,
        email: client.email,
        role: 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lawyer Registration
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, practiceArea, address, contactNo } = req.body;

    // Validate required fields
    if (!name || !email || !password || !practiceArea || !address || !contactNo) {
      return res.status(400).json({
        message: "Missing required fields: name, email, password, practiceArea, address, contactNo"
      });
    }

    // Validate practiceArea is an array
    if (!Array.isArray(practiceArea) || practiceArea.length === 0) {
      return res.status(400).json({
        message: "practiceArea must be a non-empty array of strings"
      });
    }

    // Check if lawyer already exists
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: 'Lawyer already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create lawyer
    const lawyer = new Lawyer({
      name,
      email,
      password: hashedPassword,
      practiceArea,
      address,
      contactNo
    });

    await lawyer.save();

    // Generate token
  const token = generateToken(lawyer._id, 'lawyer', lawyer.name, lawyer.email);

    res.status(201).json({
      message: 'Lawyer registered successfully',
      token,
      user: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        practiceArea: lawyer.practiceArea,
        role: 'lawyer'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lawyer Login
exports.loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if lawyer exists
    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
  const token = generateToken(lawyer._id, 'lawyer', lawyer.name, lawyer.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        practiceArea: lawyer.practiceArea,
        role: 'lawyer'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let user;

    switch (role) {
      case 'admin':
        user = await Admin.findById(userId).select('-password');
        break;
      case 'client':
        user = await Client.findById(userId).select('-password');
        break;
      case 'lawyer':
        user = await Lawyer.findById(userId).select('-password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        ...user.toObject(),
        role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId, role } = req.user;

    let UserModel;
    switch (role) {
      case 'admin':
        UserModel = Admin;
        break;
      case 'client':
        UserModel = Client;
        break;
      case 'lawyer':
        UserModel = Lawyer;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
