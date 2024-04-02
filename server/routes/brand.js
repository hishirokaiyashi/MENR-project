const router = require("express").Router();
const brandController = require("../controller/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBrand",[verifyAccessToken, isAdmin], brandController.createBrand);

router.get("/getAllBrands", brandController.getAllBrands);

router.put("/updateBrandById/:brandId",[verifyAccessToken, isAdmin], brandController.updateBrandById);

router.delete("/deleteBrandById/:brandId",[verifyAccessToken, isAdmin], brandController.deleteBrandById);


// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
