const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const User = require("../models/User");

exports.userAuthentication = async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "No Token, Authorization Denied",
    });
  }

  if (!token.startsWith("Bearer")) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "No Token, Authorization Denied",
    });
  }

  token = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Authorization Denied",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

exports.isSocketAuthenticated = async (socket, next) => {
  let token = socket.request.headers.token;
  if (!token) {
    return socket.emit({ message: "No Token. Authorization Denied" });
  }
  if (!token.startsWith("Bearer")) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "No Token, Authorization Denied",
    });
  }

  token = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Authorization Denied",
      });
    }

    socket.user = user;

    next();
  } catch (error) {
    socket.emit({ message: error.message });
  }
};
