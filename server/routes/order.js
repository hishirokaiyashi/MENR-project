const router = require("express").Router();
const orderController = require("../controller/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createNewOrder",verifyAccessToken, orderController.createNewOrder);

router.get("/getOrderByUserId",verifyAccessToken, orderController.getOrderByUserId);
router.get("/getAllOrdersByAdmin", [verifyAccessToken, isAdmin],orderController.getAllOrdersByAdmin);

router.put("/updateStatusOrder/:oId",[verifyAccessToken, isAdmin], orderController.updateStatusOrder);
// router.put("/likeBlog/:bId",[verifyAccessToken, isAdmin], blogController.likeBlog);
// router.put("/disLikeBlog/:bId",[verifyAccessToken, isAdmin], blogController.disLikeBlog);
// router.put(
//     "/uploadImages/:bid",
//     [verifyAccessToken, isAdmin],
//     uploader.single("data-images"),
//     blogController.uploadImagesBlog
//   );
  

// router.delete("/deleteBlogById/:bId",[verifyAccessToken, isAdmin], blogController.deleteBlogById);

// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;