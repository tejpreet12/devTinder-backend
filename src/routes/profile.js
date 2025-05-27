const express = require("express");
const { authMiddleware } = require("../middlewares/auth.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();
const SALT_ROUNDS = 10;

profileRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user, status: 200 });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    const allowedEditableData = ["firstName", "lastName", "skills", "photoURL"];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditableData.includes(field)
    );

    if (!isEditAllowed) {
      throw new Error("Unallowed types present in body.");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send({
      message: `${loggedInUser?.firstName} your profile is update successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

profileRouter.patch("/profile/password", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user;
    // Ask the user for current password
    const currentPassword = req.body?.currentPassword;
    const hashedPassword = currentUser?.password;
    // Match the hash for the current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      hashedPassword
    );

    if (!isValidPassword) throw new Error("Wrong current password");

    // check the new password is strong or not

    if (!validator.isStrongPassword(req.body?.newPassword))
      throw new Error("New password is weak.");

    // match the new password with confirm password
    if (req.body?.newPassword !== req.body?.confirmNewPassword)
      throw new Error("New Passwords doesn't match");

    // update the password
    const newHashedPassword = await bcrypt.hash(
      req.body?.newPassword,
      SALT_ROUNDS
    );

    currentUser.password = newHashedPassword;

    await currentUser.save();

    //clear the current cookie and ask user to sign in again
    res.clearCookie("token");

    res.json({ message: "User password update successfully" });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

module.exports = profileRouter;
