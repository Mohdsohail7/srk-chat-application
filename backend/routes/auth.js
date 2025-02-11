const express = require("express");
const { createUser, loginUser, getAllMessages, getAllUsers } = require("../controllers/auth");
const router = express.Router();

// route for registeration
router.post("/register", createUser);

// route for login
router.post("/login", loginUser);

// route for users
router.get("/users", getAllUsers);

module.exports = router;