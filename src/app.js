const express = require("express");
const app = express();
const PORT = 7777;
const HOSTNAME = '127.0.0.1';


app.get("/user/:userId/:gender",(req,res) => {
    console.log(req.params,"params");
    res.json({
        name:"Tejpreet Singh",
        code:"NTZ 2044",
    })
})


app.listen(PORT, () => {
    console.log("Server start on port 7777");
})
