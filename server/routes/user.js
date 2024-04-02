const router = require("express").Router();
const userController = require("../controller/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refreshAccessToken);
router.post("/logout", userController.logout);

router.get("/forgotpassword", userController.forgotPassword);

router.put("/resetpassword", userController.resetPassword);

// router.get("/getAllUsers", [verifyAccessToken,isAdmin], userController.getAllUsers);

router.use(verifyAccessToken);
router.get("/current", userController.getUserByToken);
router.get("/getAllUsers", isAdmin, userController.getAllUsers);

router.put("/updateCurrentUser", userController.updateUser);
router.put("/updateUserAddress", userController.updateUserAddress);
router.put("/updateCurrentUserByAdmin/:uid", isAdmin, userController.updateUserByAdmin);
router.put("/updateCart", userController.updateCart);

router.delete("/deleteUserById", isAdmin, userController.deleteUserById);

// CREATE (PORST) + PUT - body
// GET + DELETE - Query // ?asasv

module.exports = router;
