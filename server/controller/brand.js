const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBrand: response
      ? response
      : "Cannot create new Brand",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.status(200).json({
    success: response ? true : false,
    brands: response ? response : "Cannot get all Brands",
  });
});

const updateBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const response = await Brand.findByIdAndUpdate(brandId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedBrand: response ? response : "Cannot update Brand",
  });
});

const deleteBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const response = await Brand.findByIdAndDelete(brandId);
  return res.status(200).json({
    success: response ? true : false,
    deletedBrand: response ? response : "Cannot deleted Brand",
  });
});

module.exports = {
  createBrand,
  updateBrandById,
  getAllBrands,
  deleteBrandById,
};
