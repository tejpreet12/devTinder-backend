const SECRET_JWT_KEY =
  "ad6dbf08b6fc80bf738d4464890f05d3548a089be47d26405cb8509aedfffb73";

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 4,
      require: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      require: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter correct mail address");
        }
      },
    },
    password: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new error("Gender not supported");
        }
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter url address");
        }
      },
      default:
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({firstName: 1 , lastName:1})

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, SECRET_JWT_KEY, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );

  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
