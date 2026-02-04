const {DBMODELS} = require("../../database/models/init-models");

const postReview = async (req, res) => {
  try {
    const postUserReview = await DBMODELS.review_rating.create(req?.body);
    if (postUserReview) {
      return res
        .status(200)
        .json({ msg: "Succeessfully created", postUserReview });
    } else {
      return res.status(404).json({ msg: "Not created"});
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getReview = async (req, res) => {
  try {
    const getUserReview = await DBMODELS.review_rating.findAll();
    if (getUserReview) {
      return res.status(201).json({ msg: "Get all review", getUserReview });
    } else {
      return res.status(404).json({ msg: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const editRiview = async (req, res) => {
  const { reviewId } = req.params;
  const body = req.body;
  try {
    const editUserRiview = await DBMODELS.review_rating.update(body,{
      where: {
        id : reviewId,
      },
    });
    if (editUserRiview) {
      return res.status(200).json({ msg: "Edit successfully", editUserRiview });
    } else {
      return res.status(404).json({ msg: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const delteReview = async (req, res) => {
  const {reviewId} = req.params;
  try {
    const deleteUserReview = await DBMODELS.review_rating.destroy({
      where: {
        id: reviewId,
      },
    });
    if (deleteUserReview) {
      return res
        .status(200)
        .json({ msg: "Successfully delete", deleteUserReview });
    } else {
      return res.status(404).json({ msg: "Not deleted" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
    postReview,
    getReview,
    editRiview,
    delteReview
}