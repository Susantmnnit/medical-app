const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");
  // console.log(req.body);
  console.log("Received Authorization Header:", token);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const tokenPart = token.split(" ")[1];
    // console.log("Extracted Token:", tokenPart);

    const decoded = jwt.verify(tokenPart, process.env.SECRET_KEY);

    // console.log("Decoded Token:", decoded);

    req._id = decoded._id;
    console.log(req._id);
    if (!req._id) {
      throw new Error("Invalid token payload: 'userId' not found");
    }

    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
