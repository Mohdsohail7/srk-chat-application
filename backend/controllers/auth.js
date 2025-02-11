const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Message = require("../models/messages");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


// user register controller
async function createUser(req, res) {
    // input taking from body;
    const { username, password } = req.body;
    // input validation
    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required."});
    }
    try {
        // user exist
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(404).json({ message: "user already exist. Please try again."});
        }

        // convert password to hashing
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create new user 
        const newUser = new User({username: username, password: hashPassword });
        // check user created or not
        if (newUser.length === 0) {
            return res.status(400).json({ message: "User not created."})
        }
        // user save in DB
        const user = await newUser.save();
        // authenticate
        const token = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: "4h" });
        // return successfull response
        return res.status(201).json({ message: "User Registered Successfully.", user: user });
    } catch (error) {
        return res.status(500).json({ message: "Server Internal Error While Register.", error: error.message });
    }
}

// login controller
const loginUser = async (req, res) => {
    // input taking from body;
    const { username, password } = req.body;
    // input validation
    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required."});
    }
    try {
        // find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found."});
        }

        // password matching
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials."});
        }
        // successfull response
        return res.status(200).json({ message: "Login Successfully.", username: user.username });
    } catch (error) {
        return res.status(500).json({ message: "Server Internal Error While Login.", error: error.message });
    }
}

// fetch all messages controller
const getAllMessages = async (req, res) => {
    const { sender, receiver } = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ createdAt: 1});

        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: "Messages not found."});
        }

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Server Internal Error While Fetching Messages."});
    }
}


// fetch all users controller
async function getAllUsers(req, res) {
    const { currentUser } = req.query;
    try {
        const users = await User.find({ username: { $ne: currentUser }});

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Users not found."});
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Server Internal Error While Fetching Users."});
    }
}


module.exports = { createUser, loginUser, getAllMessages, getAllUsers };