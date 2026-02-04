const { routeVerifierJwt } = require("../../routes/auth/jwt");
const {
  findFromReg,
  findFromRegister,
  findFromInstitute,
  deleteFromReg,
  deleteFromRegister,
  deleteFromInstitute,
} = require("./deleteUser.controller");

const deletionInstituteRouter = require("express")();

// operation on institute-reg-details table
deletionInstituteRouter.post("/find-from-reg", findFromReg);
deletionInstituteRouter.delete(
  "/delete-from-reg",
  routeVerifierJwt,
  deleteFromReg
);

// operation on institute-register table
deletionInstituteRouter.post("/find-from-register", findFromRegister);
deletionInstituteRouter.delete(
  "/delete-from-register",
  routeVerifierJwt,
  deleteFromRegister
);

// operation on institutions table
deletionInstituteRouter.post("/find-from-institute", findFromInstitute);
deletionInstituteRouter.delete(
  "/delete-from-institute",
  routeVerifierJwt,
  deleteFromInstitute
);

module.exports = deletionInstituteRouter;
