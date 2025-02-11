const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database/init");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/messages");

// database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    },
});

// routes
const userRegisterRoute = require("./routes/auth");
const userLoginRoute = require("./routes/auth");
const messagesRoute = require("./routes/messages"); 
const usersRoute = require("./routes/auth");

console.log("Mounting routes...");

app.use("/v1/api/auth", userRegisterRoute);
console.log('User register route mounted on /v1/api/auth');
app.use("/v1/api/auth", userLoginRoute);
app.use("/v1/api", messagesRoute);
console.log('Messages route mounted on /v1/api/messages');
app.use("/v1/api/auth", usersRoute);

// socket io logic
io.on("connection", (socket) => {
    console.log("User Connected,", socket.id);

    socket.on("send_message", async (data) => {
        const { sender, receiver, message } = data;
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();

        socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.", socket.id);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});