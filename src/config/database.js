const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tejpreetsingh:XXxbCHv92zDb1DeW@namastenode.6ismr.mongodb.net/devTinderNew"
  );
};

module.exports = connectDb;

