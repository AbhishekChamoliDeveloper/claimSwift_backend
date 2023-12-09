const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

const authenticateAdmin = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Bearer token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
    const admin = await Admin.findById(decodedToken.admin._id);

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized - admin not found" });
    }

    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateAdmin;
