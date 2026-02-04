const express = require("express");
const { upload } = require("../../service/upload");
const { routeVerifierJwt } = require("../auth/jwt");
const {
  postCategoryHandler,
  deleteCategory,
  updateCategory,
  getCategoryHandler,
} = require("./category.controller");
const categoryRouter = express.Router();

categoryRouter.get("/", getCategoryHandler);
categoryRouter.post(
  "/new",
  routeVerifierJwt,
  upload.single("icon"),
  postCategoryHandler
);
categoryRouter.delete("/:id", routeVerifierJwt, deleteCategory);
categoryRouter.put(
  "/:id",
  routeVerifierJwt,
  upload.single("icon"),
  updateCategory
);

module.exports = {
  categoryRouter,
};
