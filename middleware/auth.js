const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Lawyer = require('../models/Lawyer');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Alternative name for auth middleware (used in blog routes)
const authenticate = auth;

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is lawyer
const lawyerAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Access denied. Lawyer role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is client
const clientAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied. Client role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Flexible role-based authorization middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. No user role found.' 
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error in role authorization' 
      });
    }
  };
};

module.exports = { 
  auth, 
  authenticate, 
  adminAuth, 
  lawyerAuth, 
  clientAuth, 
  requireRole 
};
