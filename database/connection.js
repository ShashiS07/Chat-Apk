const mongoose = require("mongoose");
const { mongoDBUri } = require("../config");

exports.connection = async () => {
  try {
    await mongoose.connect(mongoDBUri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error -", error);
    process.exit(1);
  }
};
