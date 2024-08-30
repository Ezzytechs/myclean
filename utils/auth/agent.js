function checkAgent(req, res, next) {
  if (!req.user.isAgent) {
    return res.status(403).json({ message: "Unathorized Person!" });
  }
  next();
}

module.exports = checkAgent;
