const express = require("express");
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const authRouter = express.Router();
const SALT_ROUNDS = 10;

authRouter.post("/signup", async (req, res) => {
  try {
    // valdidation of user
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (req.body?.skills?.length > 10) {
      throw new Error("Only 10 Skills are allowed.");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: `New User Created` });
  } catch (err) {
    res.status(400).json({ message: `Unable to create user ${err.message}` });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invaild Credentials");
    }

    const isValidPassword = await user.validatePassword(password);
    console.log(isValidPassword, "VALID PASSWORD");

    if (!isValidPassword) {
      throw new Error("Invaild Credentials");
    } else {
      const token = await user.getJWT();
      console.log(token, "TOKEN");

      res.cookie("token", token);
      res.json({ message: `User logged in successfully.` });
    }
  } catch (err) {
    res.status(400).json({ message: `Unable to login user ${err.message}` });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "User Logout Successfully" });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

module.exports = authRouter;
