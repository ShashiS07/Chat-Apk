const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

module.exports = {
  port: process.env.PORT,
  mongoDBUri : process.env.MONGODB_URI,
  jwtSecret : process.env.JWT_SECRET,
  jwtExpire : process.env.JWT_EXPIRE
};
