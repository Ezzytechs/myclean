function checkAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Unathorized Person!" });
  }
  next();
}

module.exports = checkAdmin;
