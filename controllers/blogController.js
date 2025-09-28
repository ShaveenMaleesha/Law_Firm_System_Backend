const blogService = require("../services/blogService");

// =================
// LAWYER ENDPOINTS
// =================

// Lawyer: Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, topic, practiceArea, image } = req.body;
    
    // Debug logging to see JWT payload
    console.log('JWT payload (req.user):', req.user);
    
    // Validate required fields
    if (!title || !content || !topic || !practiceArea) {
      return res.status(400).json({
        success: false,
        message: "Title, content, topic, and practice area are required"
      });
    }
    
    // FIX: Handle all possible JWT payload formats (userId, id, _id)
    const lawyerId = req.user.userId || req.user.id || req.user._id;
    
    if (!lawyerId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in JWT token",
        debug: { jwtPayload: req.user } 
      });
    }
    
    const blogData = {
      title,
      content,
      topic,
      practiceArea,
      image: image || null,
      lawyer_id: lawyerId // This will now work correctly
    };
    
    console.log('Creating blog with lawyer_id:', lawyerId);
    
    const blog = await blogService.createBlog(blogData);
    
    res.status(201).json({
      success: true,
      message: "Blog created successfully and sent for admin approval",
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message
    });
  }
};

// Lawyer: Get own blogs
exports.getMyBlogs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Handle JWT payload format consistently
    const lawyerId = req.user.userId || req.user.id || req.user._id;
    
    const result = await blogService.getBlogsByLawyer(
      lawyerId,
      status,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message
    });
  }
};

// Lawyer: Update own blog (only if pending)
exports.updateMyBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, topic, practiceArea, image } = req.body;
    
    const blogData = {
      title,
      content,
      topic,
      practiceArea,
      image
    };
    
    // Remove undefined fields
    Object.keys(blogData).forEach(key => 
      blogData[key] === undefined && delete blogData[key]
    );
    
    // Handle JWT payload format consistently
    const lawyerId = req.user.userId || req.user.id || req.user._id;
    
    const blog = await blogService.updateBlog(id, lawyerId, blogData);
    
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lawyer: Delete own blog (only if pending)
exports.deleteMyBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle JWT payload format consistently
    const lawyerId = req.user.userId || req.user.id || req.user._id;
    
    await blogService.deleteBlog(id, lawyerId);
    
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// =================
// ADMIN ENDPOINTS
// =================

// Admin: Get all blogs with filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const { status, lawyer_id, practiceArea, topic, page = 1, limit = 10 } = req.query;
    
    const filters = {
      status,
      lawyer_id,
      practiceArea,
      topic
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const result = await blogService.getAllBlogs(
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message
    });
  }
};

// Admin: Approve blog
exports.approveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle JWT payload format consistently
    const adminId = req.user.userId || req.user.id || req.user._id;
    
    const blog = await blogService.approveBlog(id, adminId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Blog approved successfully",
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving blog",
      error: error.message
    });
  }
};

// Admin: Reject blog
exports.rejectBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    // Handle JWT payload format consistently
    const adminId = req.user.userId || req.user.id || req.user._id;
    
    const blog = await blogService.rejectBlog(id, adminId, rejectionReason);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Blog rejected successfully",
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting blog",
      error: error.message
    });
  }
};

// Admin: Get blog statistics
exports.getBlogStatistics = async (req, res) => {
  try {
    const stats = await blogService.getBlogStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
      error: error.message
    });
  }
};

// =================
// PUBLIC ENDPOINTS
// =================

// Public: Get approved blogs
exports.getApprovedBlogs = async (req, res) => {
  try {
    const { practiceArea, topic, lawyer_id, page = 1, limit = 10 } = req.query;
    
    const filters = {
      practiceArea,
      topic,
      lawyer_id
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const result = await blogService.getApprovedBlogs(
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching approved blogs",
      error: error.message
    });
  }
};

// Public: Get single approved blog by ID
exports.getApprovedBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await blogService.getBlogById(id);
    
    if (!blog || blog.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: "Blog not found or not approved"
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message
    });
  }
};

// Admin/Lawyer: Get blog by ID (with full access)
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await blogService.getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    // If user is lawyer, only allow access to own blogs
    // Handle JWT payload format consistently
    const userId = req.user.userId || req.user.id || req.user._id;
    
    if (req.user.role === 'lawyer' && blog.lawyer_id._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message
    });
  }
}; 
