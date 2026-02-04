const express = require("express");
const {
  createClub,
  getInstituteDetail,
  getStudentDetail,
  getAllClubs,
  getAllpublicClub,
  getPrivateClubByInstituteId,
  deletePrivateClubByInstituteId,
  deleteClub,
  getClubById,
  updateClubById,
  createClubInstitute,
  getClubInstituteById,
  updateClubInstituteById,
  getAllClubInstitute,
  createClubStudent,
  getAllClubStudent,
  updateClubStudentById,
  getClubStudentById,
  getPostDetailById,
  getClubPostByClubId,
  getAllFollowedClubByUser,
  getAllPostFromUser,
  getUserDetailClub,
  clubProfileEditDetail,
  clubUserDetail,
  getAllLikedPostByUserId,
  getAllUserCommentByUserId,
  checkUserExist,
  getAllImagesFromUserPost,
  updateLikePost,
  updateComment,
  getCommentClubPost,
  updateClubPost,
  createClubPost,
  getAllBlogs,
  getAllPostFromUserNew,
  getAllPostFromInstituteRelated,
  getAllPostOfSingleUser,
  getRecentActivity,
} = require("./club.controller");
const {LocalMulter} = require("../../service/localMulter");
const { ImageReduce } = require("../../service/imageSizeReducer");

const clubRoutes = express.Router();

// all clubs routes
clubRoutes.post("/",
LocalMulter.single("img")
,ImageReduce(500,"clubs/post")
, createClub);
clubRoutes.get('/', getAllClubs);
clubRoutes.get('/clubId/:id/',getClubById);
clubRoutes.put('/clubId/:id/',
LocalMulter.single("img")
,ImageReduce(500,"clubs/post"),
updateClubById);
clubRoutes.delete('/clubId/:id/',deleteClub);
clubRoutes.get('/public/',getAllpublicClub);
clubRoutes.get('/private/institute/:id/',getPrivateClubByInstituteId);
clubRoutes.delete('/private/institute/:id/',deletePrivateClubByInstituteId);
clubRoutes.post("/allFollowedClub/",getAllFollowedClubByUser)

// all club institute routes
clubRoutes.post("/club-institute/",createClubInstitute)
clubRoutes.get("/club-institute/",getAllClubInstitute)
clubRoutes.put("/club-institute/institute/:id",updateClubInstituteById)
clubRoutes.get("/club-institute/institute/:id",getClubInstituteById)
// clubRoutes.post("/club-institute/")

// all club student routes
clubRoutes.post("/club-student/",createClubStudent)
clubRoutes.get("/club-student/",getAllClubStudent)
clubRoutes.put("/club-student/student/:id",updateClubStudentById)
clubRoutes.get("/club-student/student/:id",getClubStudentById)
// clubRoutes.post("/club-institute/")


// get all post of clubUser
// clubRoutes.get("/getAllPostFromUser/:userType/:userId",getAllPostFromUser)
clubRoutes.get("/getAllPostFromUser/:instituteId",getAllPostFromUserNew) //new

clubRoutes.get("/getAllPostFromSingleUser/:userId/:userType",getAllPostOfSingleUser) //new
getAllPostFromInstituteRelated

clubRoutes.get("/getAllPostFromUser/institute/:instituteId",getAllPostFromInstituteRelated) //new

// get posts from clubId
clubRoutes.get("/getClubPost/:clubId",getClubPostByClubId)

// fetching student by id
clubRoutes.get("/studentDetail/:id", getStudentDetail);

// fetching institute by id
clubRoutes.get("/instituteDetail/:id", getInstituteDetail);


// club post details
clubRoutes.get("/postDetail/post/:postId", getPostDetailById)

// get user detail
clubRoutes.get("/getUserDetail/:role/:userId", getUserDetailClub)

// update user profile club
clubRoutes.put("/updateProfileClub/:userId/:userType",clubProfileEditDetail)

// get club userdetail
clubRoutes.get("/getClubUserDetail/:userId/:userType",clubUserDetail) 

// all liked posts by user
clubRoutes.get('/allLikedPostByUser/:userId', getAllLikedPostByUserId)

// all comment by user
clubRoutes.get('/allCommentByUser/:userId', getAllUserCommentByUserId);

// check if club user exist
clubRoutes.get('/checkIfUserExitAsClubUser/:userId/:type', checkUserExist)

// get all user image 
clubRoutes.get('/getAlluserImages/:userId/:userType',getAllImagesFromUserPost)

//update likes of post 

clubRoutes.put('/updatePostLikes/post/:postId/user/:userId',updateLikePost)

//update comments
clubRoutes.post('/updatePostComment/post/:postId/',updateComment)

// get all Comment of single post
clubRoutes.get('/getAllComment/post/:postId',getCommentClubPost)

// update post in club
clubRoutes.put('/updateClubPost/post/:postId',LocalMulter.single("img")
,ImageReduce(500,"clubs/post"),updateClubPost)

// create post
clubRoutes.post('/createClubPost/user/:userId/club/:clubId/',LocalMulter.single("img")
,ImageReduce(500,"clubs/post"),createClubPost)

// get all blogs for club
clubRoutes.get('/getAllBlogs', getAllBlogs)

//=========get top five recent activity ================\\

clubRoutes.get('/getTopRecentActivity',getRecentActivity)


module.exports = clubRoutes;
