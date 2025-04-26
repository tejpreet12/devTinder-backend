const authMiddleware = (req, res, next) => {
  const token = "xyze";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(500).send("Admin not authorized");
  } else {
    next();
  }
};

module.exports = {
  authMiddleware,
};
