const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database/init");
require("dotenv").config();


// database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const userRegisterRoute = require("./routes/auth");
const userLoginRoute = require("./routes/auth");

app.use("/v1/api/auth", userRegisterRoute);
app.use("/v1/api/auth", userLoginRoute);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});