const express = require("express");
const app = express();
const PORT = 7777;
const HOSTNAME = "127.0.0.1";

const { authMiddleware } = require("./middlewares/auth");

//Global Error Handler
// app.use("/", (err,req,res,next) => {
//       if(err){
//         res.status(500).send("Some Error Occured");
//       }
// })

// Auth Middleware
app.use("/admin", authMiddleware);


app.use("/admin/getAllData", (req, res) => {
  res.status(200).json({ data: ["All DATA"] });
});

app.use("/user", (req, res) => {
  throw new Error();
  // res.status(200).json({ data: ["USER DATA"] });
});

// Global Error Handler
// The order of code matters here because we will not get error handled if we have global error
// handler at top so it is recommended to error the global error handler as the last route
app.use("/", (err,req,res,next) => {
  if(err){
    res.status(500).send("Some Error Occured");
  }
})

app.listen(PORT, () => {
  console.log("Server start on port 7777");
});
