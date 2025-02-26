const jwt = require("jsonwebtoken");
const { jwtExpire, jwtSecret } = require("../config");

exports.generateToken = (_id) => {
  const token = jwt.sign({ _id }, jwtSecret, { expiresIn: jwtExpire });
  return `Bearer ${token}`;
};
