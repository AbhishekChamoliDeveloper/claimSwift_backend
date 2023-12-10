const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authenticateUser = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Bearer token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
    const user = await User.findById(decodedToken.user._id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateUser;
