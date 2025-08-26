const Blog = require("../models/Blog");

// Lawyer: Create a new blog
exports.createBlog = async (blogData) => {
  blogData.status = 'pending';
  blogData.createdAt = new Date();
  return await Blog.create(blogData);
};

// Admin: Get all blogs with filtering and pagination
exports.getAllBlogs = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.lawyer_id) query.lawyer_id = filters.lawyer_id;
  if (filters.practiceArea) query.practiceArea = { $regex: filters.practiceArea, $options: 'i' };
  if (filters.topic) query.topic = { $regex: filters.topic, $options: 'i' };
  
  const blogs = await Blog.find(query)
    .populate("lawyer_id", "name email practiceArea contactNo")
    .populate("approvedBy", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Blog.countDocuments(query);
  
  return {
    blogs,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Get blog by ID with full population
exports.getBlogById = async (id) => {
  return await Blog.findById(id)
    .populate("lawyer_id", "name email practiceArea contactNo address")
    .populate("approvedBy", "username");
};

// Lawyer: Get blogs by lawyer ID
exports.getBlogsByLawyer = async (lawyerId, status = null, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = { lawyer_id: lawyerId };
  if (status) query.status = status;
  
  const blogs = await Blog.find(query)
    .populate("approvedBy", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Blog.countDocuments(query);
  
  return {
    blogs,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Lawyer: Update own blog (only if pending)
exports.updateBlog = async (id, lawyerId, blogData) => {
  const blog = await Blog.findOne({ _id: id, lawyer_id: lawyerId, status: 'pending' });
  
  if (!blog) {
    throw new Error('Blog not found or cannot be updated');
  }
  
  blogData.updatedAt = new Date();
  return await Blog.findByIdAndUpdate(id, blogData, { new: true })
    .populate("lawyer_id", "name email practiceArea")
    .populate("approvedBy", "username");
};

// Lawyer: Delete own blog (only if pending)
exports.deleteBlog = async (id, lawyerId) => {
  const blog = await Blog.findOne({ _id: id, lawyer_id: lawyerId, status: 'pending' });
  
  if (!blog) {
    throw new Error('Blog not found or cannot be deleted');
  }
  
  return await Blog.findByIdAndDelete(id);
};

// Admin: Approve blog
exports.approveBlog = async (id, adminId) => {
  const updateData = {
    status: 'approved',
    approved: true,
    approvedBy: adminId,
    approvedAt: new Date(),
    updatedAt: new Date(),
    rejectionReason: null
  };
  
  return await Blog.findByIdAndUpdate(id, updateData, { new: true })
    .populate("lawyer_id", "name email practiceArea")
    .populate("approvedBy", "username");
};

// Admin: Reject blog
exports.rejectBlog = async (id, adminId, rejectionReason = null) => {
  const updateData = {
    status: 'rejected',
    approved: false,
    approvedBy: adminId,
    approvedAt: new Date(),
    rejectionReason: rejectionReason,
    updatedAt: new Date()
  };
  
  return await Blog.findByIdAndUpdate(id, updateData, { new: true })
    .populate("lawyer_id", "name email practiceArea")
    .populate("approvedBy", "username");
};

// Public: Get approved blogs
exports.getApprovedBlogs = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const query = { status: 'approved' };
  if (filters.practiceArea) query.practiceArea = { $regex: filters.practiceArea, $options: 'i' };
  if (filters.topic) query.topic = { $regex: filters.topic, $options: 'i' };
  if (filters.lawyer_id) query.lawyer_id = filters.lawyer_id;
  
  const blogs = await Blog.find(query)
    .populate("lawyer_id", "name practiceArea")
    .select("-approvedBy -rejectionReason")
    .sort({ approvedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Blog.countDocuments(query);
  
  return {
    blogs,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

// Get blog statistics
exports.getBlogStatistics = async () => {
  const totalBlogs = await Blog.countDocuments();
  const approvedBlogs = await Blog.countDocuments({ status: 'approved' });
  const pendingBlogs = await Blog.countDocuments({ status: 'pending' });
  const rejectedBlogs = await Blog.countDocuments({ status: 'rejected' });
  
  const practiceAreaStats = await Blog.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$practiceArea',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const lawyerStats = await Blog.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$lawyer_id',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'lawyers',
        localField: '_id',
        foreignField: '_id',
        as: 'lawyer'
      }
    },
    {
      $unwind: '$lawyer'
    },
    {
      $project: {
        lawyerName: '$lawyer.name',
        count: 1
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  return {
    total: totalBlogs,
    approved: approvedBlogs,
    pending: pendingBlogs,
    rejected: rejectedBlogs,
    practiceAreaBreakdown: practiceAreaStats,
    topBloggers: lawyerStats
  };
};
