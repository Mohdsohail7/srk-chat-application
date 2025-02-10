const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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


module.exports = { createUser, loginUser };