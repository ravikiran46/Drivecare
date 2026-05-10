const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function verify(req, res, next) {
  const authheaders = req.headers["authorization"];
  const token = authheaders && authheaders.split(" ")[1];

  if (!token) {
    return res.status(404).json({ msg: "Token not found" });
  }

  try {
    const verifieduser = jwt.verify(token, process.env.KEY);
    if (!verifieduser)
      return res.status(401).json({ msg: "Unauthorized request" });
    req.user = verifieduser;
    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid Token" });
  }
}

const isAdmin = async (req, res, next) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

const isUser = async (req, res, next) => {
  const role = req.user.role;
  if (role !== "user") {
    return res.status(403).json({ msg: "UnAuthorized!" });
  }
  next();
};

module.exports = { verify, isAdmin, isUser };
