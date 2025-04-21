const express = require("express");
const app = express();
const PORT = 3000;
const HOSTNAME = '127.0.0.1';

app.use("/test", (req,res) =>{
    res.status(200).json({
        name:"Tejpreet Singh",
        EmployeeCode:"NTZ 2044",
    })
})


app.listen(PORT, HOSTNAME, () => {
    console.log("Server start on port 7777");
})
