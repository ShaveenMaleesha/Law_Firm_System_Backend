const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticate, requireRole } = require("../middleware/auth");

// =================
// PUBLIC ROUTES (No authentication required)
// =================

// Public: Get approved blogs
router.get("/public", blogController.getApprovedBlogs);

// Public: Get single approved blog by ID
router.get("/public/:id", blogController.getApprovedBlogById);

// =================
// LAWYER ROUTES (Lawyer authentication required)
// =================

// Lawyer: Create a new blog
router.post("/", authenticate, requireRole(['lawyer']), blogController.createBlog);

// Lawyer: Get own blogs
router.get("/my-blogs", authenticate, requireRole(['lawyer']), blogController.getMyBlogs);

// Lawyer: Update own blog (only if pending)
router.put("/my-blogs/:id", authenticate, requireRole(['lawyer']), blogController.updateMyBlog);

// Lawyer: Delete own blog (only if pending)
router.delete("/my-blogs/:id", authenticate, requireRole(['lawyer']), blogController.deleteMyBlog);

// =================
// ADMIN ROUTES (Admin authentication required)
// =================

// Admin: Get all blogs with filtering
router.get("/admin/all", authenticate, requireRole(['admin']), blogController.getAllBlogs);

// Admin: Approve blog
router.patch("/admin/:id/approve", authenticate, requireRole(['admin']), blogController.approveBlog);

// Admin: Reject blog
router.patch("/admin/:id/reject", authenticate, requireRole(['admin']), blogController.rejectBlog);

// Admin: Get blog statistics
router.get("/admin/statistics", authenticate, requireRole(['admin']), blogController.getBlogStatistics);

// =================
// PROTECTED ROUTES (Admin or Lawyer)
// =================

// Admin/Lawyer: Get blog by ID (with role-based access control)
router.get("/:id", authenticate, requireRole(['admin', 'lawyer']), blogController.getBlogById);

module.exports = router;
