const express = require("express");
const { getAllMessages } = require("../controllers/auth");
const router = express.Router();

// route for fetching messages
router.get("/messages", getAllMessages);

module.exports = router;
