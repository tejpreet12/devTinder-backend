const express = require("express");
const app = express();
const PORT = 7777;
const HOSTNAME = "127.0.0.1";

const { authMiddleware } = require("./middlewares/auth");

app.use("/admin", authMiddleware);

app.use("/admin/getAllData", (req, res) => {
  res.status(200).json({ data: ["All DATA"] });
});

app.use("/user", (req, res) => {
  res.status(200).json({ data: ["USER DATA"] });
});

app.listen(PORT, () => {
  console.log("Server start on port 7777");
});
