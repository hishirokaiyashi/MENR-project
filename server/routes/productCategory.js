const router = require("express").Router();
const productCategoryController = require("../controller/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createProductCategory",[verifyAccessToken, isAdmin], productCategoryController.createProductCategory);

router.get("/getAllProductCategories", productCategoryController.getAllProductCategories);

router.put("/updateProductCategoryById/:pcId",[verifyAccessToken, isAdmin], productCategoryController.updateProductCategoryById);

router.delete("/deleteProductCategoryById/:pcId",[verifyAccessToken, isAdmin], productCategoryController.deleteProductCategoryById);


// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
