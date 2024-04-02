const Order = require("../models/order.model");
const User = require("../models/user.model");
const Coupon = require("../models/coupon.model");

const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));

  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );

  let createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
        1000 || total;
    createData = { ...createData, total: total, coupon: coupon };
  }

  const rs = await Order.create(createData);

  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Something went wrong",
  });
});

const updateStatusOrder = asyncHandler(async (req, res) => {
  const { oId } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing Status");
  const response = await Order.findByIdAndUpdate(
    oId,
    { status },
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });

  return res.json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});

const getAllOrdersByAdmin = asyncHandler(async (req, res) => {
    const response = await Order.find();
  
    return res.json({
      success: response ? true : false,
      response: response ? response : "Something went wrong",
    });
});

module.exports = {
  createNewOrder,
  updateStatusOrder,
  getOrderByUserId,
  getAllOrdersByAdmin
};
