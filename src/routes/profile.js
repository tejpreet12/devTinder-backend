const express = require("express");
const { authMiddleware } = require("../middlewares/auth.js");
const profileRouter = express.Router();

profileRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user, status: 200 });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

module.exports = profileRouter;
