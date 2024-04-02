const Blog = require("../models/blog.model");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("missing inputs");
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBlog: response ? response : "Cannot create new blog",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    dataBlogs: response ? response : "Cannot get all blogs",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing inputs");

  const response = await Blog.findByIdAndUpdate(bId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedBlog: response ? response : "Cannot update new blog",
  });
});

// *** LIKE BLOG ***
/*
 Khi người dùng like một blog thì:
 1. Check xem người đó trước đó có dislike hay không?
 -> bỏ dislike ( nếu có )
 2. Check xem người đó trước đó có like hay không?
 -> bỏ like ( nếu có )
 -> thêm like ( nếu không có )
*/

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bId } = req.params;
  if (!bId) throw new Error("missing inputs");
  const blog = await Blog.findById(bId);
  //*Dislike
  const alreayDisliked = blog?.disLikes?.find((el) => el.toString() === _id);
  if (alreayDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        //Kéo id trong mảng disLike ra
        $pull: { disLikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  }
  //* Like
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        //Kéo id trong mảng disLike ra
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $push: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  }
});

const disLikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bId } = req.params;
  if (!bId) throw new Error("missing inputs");
  const blog = await Blog.findById(bId);
  //*Dislike
  const alreayliked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreayliked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        //Kéo id trong mảng disLike ra
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  }
  //* Like
  const isDisLiked = blog?.disLikes?.find((el) => el.toString() === _id);
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        //Kéo id trong mảng disLike ra
        $pull: { disLikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bId,
      {
        $push: { disLikes: _id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      result: response,
    });
  }
});

const getBlogById = asyncHandler(async (req, res) => {
  const { bId } = req.params;

  const response = await Blog.findByIdAndUpdate(
    bId,
    { $inc: { numberViews: 1 } }, // tang so luong numberViews
    { new: true }
  )
    .populate("likes", "firstName lastName")
    .populate("disLikes", "firstName lastName");
  return res.status(200).json({
    success: response ? true : false,
    result: response,
  });
});

const deleteBlogById = asyncHandler(async (req, res) => {
  const { bId } = req.params;
  const response = await Blog.findByIdAndDelete(bId)
  return res.status(200).json({
    success: response ? true : false,
    result: response || 'Something went wrong',
  });
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;

  if (!req.file) {
    throw new Error("missing Inputs");
  }
  const response = await Blog.findByIdAndUpdate(
    bid,
    {
      image: req.file.path
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    sucess: response ? true : false,
    updatedBlog: response ? response : "Can't upload images blog",
  });
});

module.exports = {
  createNewBlog,
  updateBlog,
  getAllBlogs,
  likeBlog,
  disLikeBlog,
  getBlogById,
  deleteBlogById,
  uploadImagesBlog
};
