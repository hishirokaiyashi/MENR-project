const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing Inputs");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create new Coupon",
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.status(200).json({
    success: response ? true : false,
    Coupons: response ? response : "Cannot get all Coupons",
  });
});

const updateCouponById = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Inputs");
  if(req.body.expiry) {
    req.body.expiry = Date.now() + req.body.expiry * 24 * 60 * 60 * 1000
  }
  const response = await Coupon.findByIdAndUpdate(cId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update Coupon",
  });
});

const deleteCouponById = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  const response = await Coupon.findByIdAndDelete(cId);
  return res.status(200).json({
    success: response ? true : false,
    deletedCategory: response ? response : "Cannot deleted Coupon",
  });
});

module.exports = {
  createCoupon,
  updateCouponById,
  getAllCoupons,
  deleteCouponById,
};
