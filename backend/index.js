const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database/init");
require("dotenv").config();


// database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});