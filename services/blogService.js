const Blog = require("../models/Blog");

exports.createBlog = async (blogData) => {
  return await Blog.create(blogData);
};

exports.getAllBlogs = async () => {
  return await Blog.find();
};

exports.getBlogById = async (id) => {
  return await Blog.findById(id);
};

exports.updateBlog = async (id, blogData) => {
  return await Blog.findByIdAndUpdate(id, blogData, { new: true });
};

exports.deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};
