const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    post: {
        type: Boolean,
        default: false
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
}, { timestamps: true })

const Message = mongoose.model('messages', messageSchema);
module.exports = Message;
