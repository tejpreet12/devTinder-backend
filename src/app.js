const express = require("express");
const app = express();
const PORT = 7777;
const HOSTNAME = "127.0.0.1";

app.use(
  "/user",
  (req, res, next) => {
    next();
    // res.send("HELLO");
  },
  (req, res, next) => {
    // res.send("HELLO 2");
    next();
  },
  (req, res, next) => {
    res.send("HELLO 3");
  }
);

app.listen(PORT, () => {
  console.log("Server start on port 7777");
});
