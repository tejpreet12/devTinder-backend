const express = require("express");
const { authMiddleware } = require("../middlewares/auth.js");
const requestRouter = express.Router();

requestRouter.post(
  "/sendConnectionRequest",
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user;

      res.send(`${user.firstName} sent a Connection Request.`);
    } catch (err) {
      res.status(400).json({ message: `Error: ${err.message}` });
    }
  }
);

module.exports = requestRouter;
