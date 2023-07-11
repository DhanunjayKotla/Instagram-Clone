const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    isgroupchat: {
        type: Boolean,
        default: false
    },
    latestmsg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }
}, { timestamps: true })

const Chat = mongoose.model('chats', chatSchema);
module.exports = Chat;
