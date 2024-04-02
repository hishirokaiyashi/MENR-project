const router = require("express").Router();
const CouponController = require("../controller/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createCoupon",[verifyAccessToken, isAdmin], CouponController.createCoupon);

router.get("/getCoupons", CouponController.getAllCoupons);

router.put("/updateCouponById/:cId",[verifyAccessToken, isAdmin], CouponController.updateCouponById);

router.delete("/deleteCouponById/:cId",[verifyAccessToken, isAdmin], CouponController.deleteCouponById);


// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
