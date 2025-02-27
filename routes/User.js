const express = require("express");
const router = express.Router();
const { getAllUserList } = require("../controllers/User");
const { userAuthentication } = require("../middleware/middleware");

router.get("/list/v1", userAuthentication, getAllUserList);

module.exports = router;
