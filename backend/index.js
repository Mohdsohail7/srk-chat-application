const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});