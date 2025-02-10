const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Database Connected.");
    }).catch((error) => {
        console.log("Database Connection Failed.", error);
    })
}
module.exports = { connectDB };