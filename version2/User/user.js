const {
  userDetail,
  updateUserProfile,
  subscribe,
  searchDetails,
  getArticle,
  unSubscribe,
  nipamCircular,
  fetchStudentClass,
  updateStudentClass,
} = require("./user.controller");

const userV2Router = require("express")();
// get user detail
userV2Router.get(
  "/userDetail/role/:role/userId/:userId/instituteId/:instituteId",
  userDetail
);

// update user
userV2Router.get(
  "/updateUser/id/:userId/role/:role/updateProfile",
  updateUserProfile
);

userV2Router.post("/subscribe/:email/subscribe", subscribe);
userV2Router.post("/subscribe/:email/unsubscribe", unSubscribe);

userV2Router.post("/circular/:email/nipamCircular", nipamCircular);

// fetching class of students
userV2Router.get("/studentClass/:userId/:role", fetchStudentClass);

// updating class of students
userV2Router.post("/updateClass/:userId/:role", updateStudentClass);

userV2Router.get("/search/:searchQuery", searchDetails);
userV2Router.get("/getNewsArticle", getArticle);

module.exports = userV2Router;
