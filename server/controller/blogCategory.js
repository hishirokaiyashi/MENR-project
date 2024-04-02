const BlogCategory = require("../models/blogCategory.model");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
  if (!title) throw new Error("Missing inputs");
  const response = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBlogCategory: response
      ? response
      : "Cannot create new Blog-Category",
  });
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select("title _id");
  return res.status(200).json({
    success: response ? true : false,
    blogCategories: response ? response : "Cannot get all Blog-Category",
  });
});

const updateBlogCategoryById = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(blogId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update Blog-Category",
  });
});

const deleteBlogCategoryById = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const response = await BlogCategory.findByIdAndDelete(blogId);
  return res.status(200).json({
    success: response ? true : false,
    deletedCategory: response ? response : "Cannot deleted Blog-Category",
  });
});

module.exports = {
  createBlogCategory,
  updateBlogCategoryById,
  getAllBlogCategories,
  deleteBlogCategoryById,
};
