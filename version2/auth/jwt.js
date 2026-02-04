const JWT = require("jsonwebtoken");
const logg = require("../../utils/utils");

// INUMS
const inum = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
});
// Create JWT
async function createJWT(email) {
  return JWT.sign(
    {
      // data: email,
      email: email,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 * 20 }
  );
}

//ValidateJWT
async function verifyJWT(token) {
  return JWT.verify(token, process.env.JWT_SECRET);
}

// Route Verify
const routeVerifierJwt = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      message: "Token Not Found",
      header: req.headers,
    });
  } else {
    token = token.replace("Bearer ", "");
    try {
      const verfied = await verifyJWT(token);
      req.user = verfied.data;
      next();
    } catch (err) {
      logg.error(err);
      res
        .status(498)
        .json({ message: "Invalid Token", err: err, header: token });
    }
  }
};

module.exports = {
  inum,
  createJWT,
  verifyJWT,
  routeVerifierJwt,
};
