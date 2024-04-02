const router = require("express").Router();
const productController = require("../controller/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require('../config/cloudinary.config')
router.post(
  "/createProduct",
  [verifyAccessToken, isAdmin],
  productController.createProduct
);

router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById/:pid", productController.getProductById);

router.put(
  "/updateProductById/:pid",
  [verifyAccessToken, isAdmin],
  productController.updateProductById
);
router.put(
  "/uploadImages/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array("data-images", 10),
  productController.uploadImagesProduct
);
router.put(
  "/ratingProduct",
  [verifyAccessToken, isAdmin],
  productController.ratingProduct
);

router.delete(
  "/deleteProductById/:pid",
  [verifyAccessToken, isAdmin],
  productController.deleteProductById
);

// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
