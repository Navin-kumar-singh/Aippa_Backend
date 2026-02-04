/*
   Authorization Control
   - verify Tocken ( routeVerifierJwt() )
   - Code/decode hash
*/

const JWT = require("jsonwebtoken");

// INUMS
const inum = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
});
// Create JWT
async function createJWT(email) {
  return JWT.sign(
    {
      data: email,
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
  let token = req.headers.authorization || req.body.token;

  if (!token) {
    return res.status(495).json({
      message: "",
      header: req.headers,
    });
  } else {
    token = token.replace("Bearer ", "");
    try {
      const verfied = await verifyJWT(token);
      req.user = verfied.data;
      next();
    } catch (err) {
      res
        .status(498)
        .json({ message: "", err: err, header: token });
    }
  }
};

module.exports = {
  inum,
  createJWT,
  verifyJWT,
  routeVerifierJwt,
};
