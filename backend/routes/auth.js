const express = require("express");
const { createUser, loginUser } = require("../controllers/auth");
const router = express.Router();

// route for registeration
router.post("/register", createUser);

// route for login
router.post("/login", loginUser);

module.exports = router;