const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tejpreetsingh:Lr9H0unuGts3f8JO@namastenode.6ismr.mongodb.net/devTinderNew"
  );
};

module.exports = connectDb;

