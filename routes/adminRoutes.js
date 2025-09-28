const express = require('express');
const router = express.Router();
const { 
  getCasesStatistics, 
  getAppointmentsStatistics, 
  getBlogsStatistics 
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// Admin Dashboard Statistics Routes

// Cases Statistics - GET /api/admin/cases/statistics
router.get('/cases/statistics', auth, adminAuth, getCasesStatistics);

// Appointments Statistics - GET /api/admin/appointments/statistics  
router.get('/appointments/statistics', auth, adminAuth, getAppointmentsStatistics);

// Blogs Statistics - GET /api/admin/blogs/statistics
router.get('/blogs/statistics', auth, adminAuth, getBlogsStatistics);

module.exports = router;
