const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs");
  }
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    sucess: newProduct ? true : false,
    productData: newProduct ? newProduct : "Something went wrong",
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    sucess: product ? true : false,
    productData: product ? product : "Can't get product",
  });
});

//filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tach' cac' truong` dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((field) => delete queries[field]);

  // Format lai cac operator cho dung cu phap cua mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // ****Filtering***

  // tim theo title khong can phai danh ca ten van tim dc
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };

  let queryCommand = Product.find(formatedQueries);

  // ***Sorting***

  //abc,efg => [abc, efg] => abc efg
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    // queryCommand = queryCommand.sort('quantity title')
    queryCommand = queryCommand.sort(sortBy);
  }

  // ***fields limiting***
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // ***pagination***
  // + Limit: số object: lấy về 1 gọi API
  // skip: 2
  // 1 2 3 ... 10
  // +2 => 2
  // +dadasd => NaN
  const page = +req.query.page || 1; // mac dinh là 1 nếu không truyền giá trị
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;

  queryCommand.skip(skip).limit(limit);

  try {
    const response = await queryCommand;
    const counts = await Product.find(formatedQueries).countDocuments();

    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    });
  } catch (err) {
    console.log(err.message); // Hoặc xử lý lỗi theo cách bạn muốn
  }
});

// ***RATING PRODUCT****
const ratingProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user; // middleware tra ve

  const { star, comment, pid } = req.body;
  if (!pid || !star) {
    throw new Error("Missing inputs");
  }

  //
  const ratingProduct = await Product.findById(pid);
  const alreadyRatingProduct = ratingProduct?.rating?.find(
    (product) => product.postedBy.toString() === _id // objectId va` string
  );

  // rating: {
  //   type: [
  //     {
  //       star: { type: Number },
  //       postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  //       comment: { type: String },
  //     },
  //   ],
  //   totalRatings: {
  //     type: Number,
  //     default: 0,
  //   },
  // },
  if (alreadyRatingProduct) {
    // update star and comment
    // Đứng ở bảng sp update 1 document nào đó có rating document chứa alreadyRatingProduct
    await Product.updateOne(
      { rating: { $elemMatch: alreadyRatingProduct } },
      {
        $set: {
          //rating.$.star: giấu $ tượng trưng cho thằng element tìm đc ở {} đầu tiên
          "rating.$.star": star,
          "rating.$.comment": comment,
        },
      },
      {
        new: true,
      }
    );
  } else {
    // add star and comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: {
          rating: {
            star,
            comment,
            postedBy: _id,
          },
        },
      },
      { new: true }
    );
  }

  // Sum avarage rating
  const updatedProduct = await Product.findById(pid);
  const totalRatings = updatedProduct.rating.length;
  const averageRatings = updatedProduct.rating.reduce((sum, element) => {
    return sum + +element.star;
  }, 0);
  updatedProduct.totalRatings =
    Math.round((averageRatings * 10) / totalRatings) / 10;
  console.log(updatedProduct);
  await updatedProduct.save();

  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});

const updateProductById = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    sucess: updatedProduct ? true : false,
    updateProduct: updatedProduct ? updatedProduct : "Can't update product",
  });
});

const deleteProductById = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    sucess: deletedProduct ? true : false,
    deleteProduct: deletedProduct ? deletedProduct : "Can't delete product",
  });
});

// *** UPLOAD IMAGE FOR PRODUCT *** //
const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  if (!req.files) {
    throw new Error("missing Inputs");
  }
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((file) => file.path) } },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    sucess: response ? true : false,
    updatedProduct: response ? response : "Can't upload images product",
  });
});



module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  ratingProduct,
  uploadImagesProduct,
};
