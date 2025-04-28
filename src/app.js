const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const PORT = 7777;
const HOSTNAME = "127.0.0.1";

app.post("/signup", async (req, res) => {
  const userObj = {
    name: "Joe",
    lastName: "Root",
    emailId: "joe@mail.com",
    password: "Test@123",
    age: 33,
    gender: "Male",
  };

  const user = new User(userObj);

  try {
    await user.save();
    res.json({ message: `User Created` });
  } catch (err) {
    res.status(400).json({ message: `Unable to create user ${err.message}` });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log("Server start on port 7777");
    });
  })
  .catch((err) => {
    console.log("err => ", err);
  });
