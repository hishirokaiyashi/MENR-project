const router = require("express").Router();
const blogCategoryController = require("../controller/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBlogCategory",[verifyAccessToken, isAdmin], blogCategoryController.createBlogCategory);

router.get("/getAllBlogCategories", blogCategoryController.getAllBlogCategories);

router.put("/updateBlogCategoryById/:blogId",[verifyAccessToken, isAdmin], blogCategoryController.updateBlogCategoryById);

router.delete("/deleteBlogCategoryById/:blogId",[verifyAccessToken, isAdmin], blogCategoryController.deleteBlogCategoryById);


// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
