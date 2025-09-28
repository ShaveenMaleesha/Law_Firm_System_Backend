const Case = require('../models/Case');
const Appointment = require('../models/Appointment');
const Blog = require('../models/Blog');

// Get Cases Statistics
const getCasesStatistics = async (req, res) => {
  try {
    // Get total cases
    const totalCases = await Case.countDocuments();
    
    // Get ongoing cases (active and pending status)
    const ongoingCases = await Case.countDocuments({ 
      status: { $in: ['active', 'pending', 'on-hold'] } 
    });
    
    // Get approved cases (active cases are considered approved)
    const approvedCases = await Case.countDocuments({ 
      status: 'active' 
    });

    res.status(200).json({
      success: true,
      data: {
        totalCases,
        ongoingCases,
        approvedCases
      }
    });
  } catch (error) {
    console.error('Error fetching cases statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cases statistics',
      error: error.message
    });
  }
};

// Get Appointments Statistics
const getAppointmentsStatistics = async (req, res) => {
  try {
    // Get pending appointments
    const pendingAppointments = await Appointment.countDocuments({ 
      status: 'pending' 
    });
    
    // Get approved appointments
    const approvedAppointments = await Appointment.countDocuments({ 
      status: { $in: ['approved', 'completed'] }
    });
    
    // Get rejected appointments
    const rejectedAppointments = await Appointment.countDocuments({ 
      status: 'rejected' 
    });

    res.status(200).json({
      success: true,
      data: {
        pendingAppointments,
        approvedAppointments,
        rejectedAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching appointments statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments statistics',
      error: error.message
    });
  }
};

// Get Blogs Statistics
const getBlogsStatistics = async (req, res) => {
  try {
    // Get total blogs
    const total = await Blog.countDocuments();
    
    // Get pending blogs
    const pending = await Blog.countDocuments({ 
      status: 'pending' 
    });
    
    // Get approved blogs
    const approved = await Blog.countDocuments({ 
      status: 'approved' 
    });
    
    // Get rejected blogs
    const rejected = await Blog.countDocuments({ 
      status: 'rejected' 
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected
      }
    });
  } catch (error) {
    console.error('Error fetching blogs statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs statistics',
      error: error.message
    });
  }
};

module.exports = {
  getCasesStatistics,
  getAppointmentsStatistics,
  getBlogsStatistics
};
