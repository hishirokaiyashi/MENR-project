const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      sucess: false,
      mes: "Missing inputs",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User is already registered");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      mes: newUser ? "create user successfully" : "something went wrong",
    });
  }
});

// RefreshToken -> Cap moi accessToken
// AccessToken -> Xac thuc nguoi dung - Phan quyen nguoi dung

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      sucess: false,
      mes: "Missing inputs",
    });
  }

  const response = await User.findOne({ email });

  if (response && (await response.isCorrectPassword(req.body.password))) {
    // biến object nhiều tầng thành plain object
    // Khong show password and role khi tra ve data
    const { password, role, refreshToken, ...userData } = response.toObject();
    //Create accessToken && refreshToken
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);

    // Update lai refreshToken vao database - new : true la tra ve data sau khi update
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // Luu refreshToken vao cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      sucess: true,
      mes: "Login successfully!!!",
      accessToken,
      userData,
    });
  } else {
    throw new Error("invalid credentials");
  }
});

const getUserByToken = asyncHandler(async (req, res) => {
  // req.user from JWT trả về
  const { _id } = req.user;

  // "-" + trường không muốn hiển thị các trường lúc trả về
  const user = await User.findById(_id).select("-refreshToken -password -role");

  return res.status(200).json({
    sucess: user ? true : false,
    user: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  const response = await jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET
  );
  // Check xem token co khop voi token da luu trong database khong?
  const responseUserByToken = await User.findOne({
    _id: response._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    sucess: response ? true : false,
    newAccessToken: responseUserByToken
      ? generateAccessToken(responseUserByToken._id, responseUserByToken.role)
      : "refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Xoa refresh token o database
  // Ham update co ba doi so:
  // + Dau tien la dieu kien
  // + Doi so thu 2 la update lai
  // + new la true la tra ve database moi
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.status(200).json({
    sucess: true,
    mess: "logout successfully",
  });
});

// **Reset Password**
// + Client gui email
// + Server check email hop le hay khong?
// => hop le thi gui mail kem theo link(password change token)
// + Client check mail -> click vao link da~ nhan tu server
// + Client gui api kem theo token
// + Server check token cua client co giong voi token ma server gui hay khong?
// + Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    throw new Error("Missing email!!!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }

  const resetToken = user.createPasswordChangedToken();
  await user.save(); // luu vao database

  const html = `Xin vui long click vao link duoi day de thay doi mat khau cua ban.Link nay se het han sau 15 phut ke tu bay gio. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };

  const rs = await sendMail(data);
  return res.status(200).json({
    sucess: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // Kiem tra xem tokenPassword co het han trong database khong?
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExprires: { $gt: Date.now() }, // > dieu kien phai lon thoi gian hien tai
  });
  if (!user) {
    throw new Error("Invalid reset token");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExprires = undefined;
  await user.save();

  return res.status(200).json({
    success: user ? true : false,
    mess: user ? "Updated password successfully" : "Something went wrong",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");

  return res.status(200).json({
    sucess: response ? true : false,
    users: response,
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) {
    throw new Error("Missing input");
  }
  const response = await User.findByIdAndDelete(_id);

  return res.status(200).json({
    sucess: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted successfully`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refeshToken");

  return res.status(200).json({
    sucess: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refeshToken");

  return res.status(200).json({
    sucess: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) {
    throw new Error("Missing input");
  }
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refeshToken");

  return res.status(200).json({
    sucess: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quanity, color } = req.body;
  if (!pid || !quanity || !color) {
    throw new Error("Missing input");
  }

  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );

  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        {
          cart: { $elemMatch: alreadyProduct },
        },
        { $set: { "cart.$.quanity": quanity } },
        { new: true }
      );
      return res.status(200).json({
        sucess: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quanity, color } },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        sucess: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quanity, color } },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      sucess: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getUserByToken,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUserById,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
};
