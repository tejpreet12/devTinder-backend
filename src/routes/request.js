const express = require("express");
const { authMiddleware } = require("../middlewares/auth.js");
const User = require("../models/user.js");
const {
  ConnectionRequestModel: ConnectionRequest,
} = require("../models/connectionRequest.js");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, userId } = req.params;

      const fromUserId = user._id;
      const toUserId = userId;

      const allowedStatuses = ["interested", "ignored"];

      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const doesRequestUserExist = await User.findById(userId);

      if (!doesRequestUserExist) {
        throw new Error("User not found");
      }

      const doesConnectionRequestAlreadyExist = await ConnectionRequest.findOne(
        {
          $or: [
            {
              fromUserId,
              toUserId,
            },
            {
              fromUserId: toUserId,
              toUserId: fromUserId,
            },
          ],
        }
      );

      if (doesConnectionRequestAlreadyExist) {
        throw new Error("Connection request already exists");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();
      res.json({
        message:
          status === "interested"
            ? `${user?.firstName} is interested in ${doesRequestUserExist?.firstName}`
            : `${user?.firstName} ignored ${doesRequestUserExist?.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: `Error: ${err.message}` });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connect Request not Found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: `Connection Request ${status}`, data, status: "OK" });
    } catch (err) {
      res.status(400).json({ Error: `ERROR: ${err.message} ` });
    }
  }
);

module.exports = requestRouter;
