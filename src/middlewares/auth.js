const SECRET_JWT_KEY =
  "ad6dbf08b6fc80bf738d4464890f05d3548a089be47d26405cb8509aedfffb73";

const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("No token found");
    }

    let userId = "";

    jwt.verify(token, SECRET_JWT_KEY, function (err, decoded) {
      userId = decoded?._id;
    });

    const user = await User.findById(userId);

    if (!user) throw new Error("No user found");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({ response: `${err.message}` });
  }
};

module.exports = {
  authMiddleware,
};
