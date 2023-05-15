const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const loginLimiter = require("../../middleware/loginLimiter");

//TODO: Add verify roles add other API, currently just for testing purpose.
router.route("/login").post(loginLimiter, authController.handleLogin);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
module.exports = router;
