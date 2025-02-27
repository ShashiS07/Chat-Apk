const Chat = require("../models/Chat");
const User = require("../models/User");

exports.getAllUserList = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: { $ne: req.user._id },
        },
      },
      {
        $sort: {
          createadAt: -1,
        },
      },
    ];

    const users = await User.aggregate(pipeline);

    return res
      .status(200)
      .json({ status: 200, success: true, message: "All users", data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

exports.changeUserStatus = async (body) => {
  try {
    const { id } = body;
    let user = await User.findById(id);

    user.isOnline = !user.isOnline;

    user = await user.save();

    return user;
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

exports.sendMessage = async (io, socket, body, callback) => {
  try {
    let { message, receiverId, senderId } = body;

    let chat = new Chat({ senderId, receiverId, message });
    await chat.save();

    // Notify sender that message was successfully saved
    callback({ success: true, data: chat });

    // Emit new message to the receiver
    io.to(receiverId).emit("recievemessage", {
      senderId,
      message,
    });
  } catch (error) {
    callback({ error: error.message });
  }
};
