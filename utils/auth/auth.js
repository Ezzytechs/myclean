const jwt = require("jsonwebtoken");
require("dotenv/config");
const mySecret = process.env.TOKEN_SECRET;
const { User } = require("../../models/users");
function checkUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Forbidden!" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, mySecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Forbidden!" });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token,
    });
    if (!user) {
      return res.status(400).json({ message: "No User Forbidden" });
    }
    req.user = decoded;
    req.mainUser = user;
    req.token = token;
    next();
  });
}

module.exports = checkUser;
