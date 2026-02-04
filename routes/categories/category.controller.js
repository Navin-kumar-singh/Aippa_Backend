const { valid, func } = require("joi");
const { CATEGMODEL, USERMODEL } = require("../../model/models");
const { categorySchema } = require("../auth/validation");
const fs = require("fs");
const path = require("path");
const logg = require("../../utils/utils");

async function postCategoryHandler(req, res) {
  details = await USERMODEL.findOne({ email: req.user });
  const user = {
    userId: details._id,
    userEmail: req.user,
  };
  const validation = await categorySchema.validate(req.body);
  //validation error
  if (validation.error) {
    if (req.file) {
      if (fs.existsSync(file.path)) {
        // fs.unlinkSync(req.file.path);
      }
    }
    return res.status(400).json({
      message: validation.error.message,
    });
  }
  if (req.file) {
    //validation is ok
    checkCategory = await CATEGMODEL.findOne({ slug: req.body.slug });
    if (checkCategory) {
      return res
      // console.log("HELLO EVERYTHING")
        .status(203)
        .json({ message: "category slug should be a unique value" });
    } else {
      const savedCategory = {
        ...validation.value,
        icon: req.file.path,
        seller: user,
      };
      new CATEGMODEL(savedCategory).save();
      res.status(200).json({
        category: savedCategory,
        message: "category has been created successfully",
      });
    }
  } else {
    return res.json({ message: "No Image Found" });
  }
}
async function updateCategory(req, res) {
  const validation = await categorySchema.validate(req.body);
  //validation error
  if (validation?.error) {
    return res.status(400).json({
      message: validation.error.message,
    });
  }
  let updatedCategory;
  if (req.file) {
    iconUrl = req.file.path;
    updatedCategory = {
      ...validation.value,
      icon: iconUrl,
    };
    try {
      const details = await CATEGMODEL.findById(req.params.id);
      if (fs.existsSync(details.icon)) {
        // fs.unlinkSync(details.icon);
      }
    } catch (error) {
      logg.error(error);
      res.json({ message: "OOPs Something Went Wrong", error: error.message });
    }
  } else {
    updatedCategory = {
      ...validation.value,
    };
  }
  await CATEGMODEL.findByIdAndUpdate(req.params.id, {
    ...updatedCategory,
  })
    .then((Res) => {
      res.send(Res);
    })
    .catch((Err) => {
      logg.error(Err);
    });
}
async function deleteCategory(req, res) {
  userdetails = await USERMODEL.findOne({ email: req.user });
  const category = await CATEGMODEL.findById(req.params.id);
  if (!category) return res.json({ message: "Category Not Found !!" });
  let checkAuth =
    userdetails.email == category.seller.userEmail &&
    userdetails.profile == "customer";
  if (checkAuth) {
    const { icon } = await CATEGMODEL.findById(req.params.id);
    await CATEGMODEL.findByIdAndRemove(req.params.id);
    if (fs.existsSync(icon)) {
      // fs.unlinkSync(icon);
    }
    res.json({
      message: "Category Deleted Successfully",
    });
  } else {
    res.json({ message: "you are not authorized to delete this category" });
  }
}
async function getCategoryHandler(req, res) {
  const category = await CATEGMODEL.find();
  res.json({ data: category, message: "category fetched succesfully" });
}

module.exports = {
  postCategoryHandler,
  deleteCategory,
  updateCategory,
  getCategoryHandler,
};
