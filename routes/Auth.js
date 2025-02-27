const express = require("express");
const router = express.Router();
const {
  checkUserExist,
  loginUser,
  registerUser,
} = require("../controllers/Auth");

router.get("/check/user/v1", checkUserExist);
router.post("/login/v1", loginUser);
router.post("/register/v1", registerUser);

module.exports = router;
