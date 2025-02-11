const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);
module.exports = mongoose.model("Messages", messagesSchema);