const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require("bcrypt");

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    receiver: {
      type: ObjectId,
      ref: "users",
    },
    sender: {
      type: ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

chatSchema.pre("save", function (next) {
  if (this.isModified("message")) {
    const salt = bcrypt.genSaltSync(10);
    this.message = bcrypt.hashSync(this.message, salt);
  }
  next();
});

module.exports = mongoose.model("Chat", chatSchema);
