const express = require("express");
const { postReview, getReview, editRiview, delteReview } = require("./review_rating");

const reviewRouter = express.Router();

// post review
reviewRouter.post('/postReview_rating', postReview)
// get review
reviewRouter.get('/getReview_rating', getReview)
// edit review
reviewRouter.put('/editReview_rating/:reviewId', editRiview)
// delete review
reviewRouter.delete('/deleteReview_rating/:reviewId', delteReview)

module.exports={
    reviewRouter
}