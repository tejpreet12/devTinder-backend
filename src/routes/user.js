const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  ConnectionRequestModel: ConnectionRequest,
} = require("../models/connectionRequest");
const userRouter = express.Router();

const SAFE_POPULATE_KEYS = "firstName lastName";

userRouter.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (connectionRequests.length === 0) {
      return res.json({ message: "No request found", status: "Ok" });
    }

    res.json({
      message: "User request found successfully",
      data: connectionRequests,
      status: "ok",
    });
  } catch (err) {
    res.status(400).json({ Error: `ERROR: ${err.message}`, Status: "Not Ok" });
  }
});

userRouter.get("/user/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", SAFE_POPULATE_KEYS)
      .populate("toUserId", SAFE_POPULATE_KEYS);


    const data = connectionRequests.map((data) => {
      if (data.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return data.toUserId;
      }
      return data.fromUserId;
    });

    res.json({
      message: "User Connections",
      data,
      status: "Ok",
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: `ERROR: ${err.message}`, status: "Not Ok" });
  }
});

module.exports = userRouter;
