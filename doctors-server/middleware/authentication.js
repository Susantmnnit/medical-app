const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const tokenPart = token.split(" ")[1];

    const decoded = jwt.verify(tokenPart, process.env.SECRET_KEY);

    req._id = decoded._id;
    if (!req._id) {
      throw new Error("Invalid token payload: 'userId' not found");
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
