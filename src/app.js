const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation.js");
const PORT = 7777;
const HOSTNAME = "127.0.0.1";
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());

// /user for single user with emailId

app.get("/user", async (req, res) => {
  const email = req.body?.emailId;

  try {
    const user = await User.findOne({ emailId: email });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: `No user found` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong : ${err.message}` });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.json({ message: "User delete successfully" });
    } else {
      res.status(404).json({ message: `No user found` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong : ${err.message}` });
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  try {
    const ALLOWED_TYPES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "skills",
    ];
    const isUpdationAllowed = Object.keys(req.body).every((val) =>
      ALLOWED_TYPES.includes(val)
    );

    if (!isUpdationAllowed) {
      throw new Error("Update not allowed");
    }

    if (req.body?.skills?.length > 10) {
      throw new Error("Only 10 Skills are allowed.");
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      req.body,
      { returnDocument: "before", runValidators: true }
    );
    if (updatedUser) {
      res.json({ message: "User update successfully", updatedUser });
    } else {
      res.status(404).json({ message: `No user found` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong : ${err.message}` });
  }
});

// patch with emailID
// app.patch("/user", async (req, res) => {
//   const emailId = req.body.emailId;

//   try {
//     const updatedUser = await User.findOneAndUpdate({ emailId }, req.body);
//     if (updatedUser) {
//       res.json({ message: "User update successfully", updatedUser });
//     } else {
//       res.status(404).json({ message: `No user found` });
//     }
//   } catch (err) {
//     res.status(400).json({ message: `Something went wrong : ${err.message}` });
//   }
// });

// /feed for all users

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: `No user found` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong : ${err.message}` });
  }
});

// HW findByID

app.get("/user/:ID", async (req, res) => {
  const userId = req.params.ID;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: `No user found` });
    }
  } catch (err) {
    res.status(400).json({ message: `Something went wrong : ${err.message}` });
  }
});

app.post("/signup", async (req, res) => {
  try {

    // valdidation of user
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

app.post("/login", async (req, res) => {

  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invaild Credentials");
    }
    console.log(password,"password");
    console.log(user.password,"user.password");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invaild Credentials");
    } else {
      res.json({ message: `User logged in successfully.` })
    }

  } catch (err) {
    res.status(400).json({ message: `Unable to login user ${err.message}` });
  }

})

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
