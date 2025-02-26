const User = require("../models/User");
const { generateToken } = require("../util/generateToken");
const bcrypt = require("bcrypt");

exports.checkUserExist = async (req, res) => {
  try {
    let { mobileNumber } = req.body;

    let user = await User.findOne({ mobileNumber });

    if (user) {
      return res.status(400).json({
        status: 404,
        success: true,
        message:
          "User Already Exist With this number. Kindly Try different one",
      });
    }

    return res
      .status(200)
      .json({ status: 200, success: true, message: "New User" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    let user = new User({
      ...req.body,
    });

    user = await user.save();

    const token = await generateToken(user._id);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "User Registered Successfully",
      data: user,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { mobileNumber, password } = req.body;

    let user = await User.findOne({ mobileNumber });

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User Not Found" });
    }

    const matchPassword = await bcrypt.compareSync(password, user.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: "Invalid Password" });
    }

    const token = await generateToken(user._id);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login Successfully",
      data: user,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: true, message: error.message });
  }
};
