const router = require("express").Router();
const blogController = require("../controller/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require('../config/cloudinary.config')

router.post("/createBlog",[verifyAccessToken, isAdmin], blogController.createNewBlog);

router.get("/getAllBlogs", blogController.getAllBlogs);
router.get("/getBlogById/:bId", blogController.getBlogById);

router.put("/updateBlogById/:bId",[verifyAccessToken, isAdmin], blogController.updateBlog);
router.put("/likeBlog/:bId",[verifyAccessToken, isAdmin], blogController.likeBlog);
router.put("/disLikeBlog/:bId",[verifyAccessToken, isAdmin], blogController.disLikeBlog);
router.put(
    "/uploadImages/:bid",
    [verifyAccessToken, isAdmin],
    uploader.single("data-images"),
    blogController.uploadImagesBlog
  );
  

router.delete("/deleteBlogById/:bId",[verifyAccessToken, isAdmin], blogController.deleteBlogById);

// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
