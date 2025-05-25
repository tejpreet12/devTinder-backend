const express = require("express");
const app = express();
const connectDB = require("./config/database.js");

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

const PORT = 7777;
const HOSTNAME = "127.0.0.1";

const saltRounds = 10;
const SECRET_JWT_KEY =
  "ad6dbf08b6fc80bf738d4464890f05d3548a089be47d26405cb8509aedfffb73";

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
