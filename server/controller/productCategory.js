const ProductCategory = require("../models/productCategory.model");
const asyncHandler = require("express-async-handler");

const createProductCategory = asyncHandler(async(req,res)=>{
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdProductCategory: response ? response : "Cannot create new Product-Category"
    })
})

const getAllProductCategories = asyncHandler(async(req,res)=>{
    const response = await ProductCategory.find().select('title _id');
    return res.status(200).json({
        success: response ? true : false,
        productCategories: response ? response : "Cannot get all Product-Category"
    })
})

const updateProductCategoryById = asyncHandler(async(req,res)=>{
    const {pcId} = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcId, req.body,{new: true});
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : "Cannot update Product-Category"
    })
})

const deleteProductCategoryById = asyncHandler(async(req,res)=>{
    const {pcId} = req.params
    const response = await ProductCategory.findByIdAndDelete(pcId);
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : "Cannot deleted Product-Category"
    })
})

module.exports = {
    createProductCategory,
    updateProductCategoryById,
    getAllProductCategories,
    deleteProductCategoryById,
  };
  