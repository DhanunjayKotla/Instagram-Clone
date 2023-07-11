const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    commentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    reply: { type: Boolean, default: false },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }
}, { timestamps: true })

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
