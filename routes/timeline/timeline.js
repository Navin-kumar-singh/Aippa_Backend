
const express = require("express");
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    createComment,
    getAllCommentsForPost,
    updateComment,
    deleteComment,
    getAllComments,
    getAllInstitutes,
    currentInstituteDetails,
    currentTeacherDetails,
    postLikeByNormalUser,
  } = require("./timeline.controller");
const timelineRouter = express.Router();
const {LocalMulter} = require("../../service/localMulter")
const {ImageReduce} = require("../../service/imageSizeReducer")



//get detail of institute

timelineRouter.post("/getInstituteDetail",currentInstituteDetails);

//get teacher detail 
timelineRouter.post("/getTeacherDetail",currentTeacherDetails);

//get all institutes
timelineRouter.get("/getAllInstitute",getAllInstitutes);

// normal user like post
timelineRouter.put("/postlike/:postId", postLikeByNormalUser);



//all posts routes
timelineRouter.post("/post",LocalMulter.single("img")
,ImageReduce(500,"timeline/posts")
,createPost);
timelineRouter.get("/get",getAllPosts);
timelineRouter.get("/:id", getPostById);
timelineRouter.put("/:id",LocalMulter.single("imgs"),ImageReduce(500,"timeline/posts") ,updatePost);
timelineRouter.delete("/:id",deletePost);


// all comments routes

timelineRouter.post("/comment",createComment);
timelineRouter.get("/comment/:postId",getAllCommentsForPost);
timelineRouter.get("/comments/all",getAllComments);
timelineRouter.put("/comment/:id",updateComment);
timelineRouter.delete("/comment/:id",deleteComment);

module.exports = timelineRouter;
