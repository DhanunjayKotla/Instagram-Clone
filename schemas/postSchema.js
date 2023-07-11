const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postPic: { type: String },
    contentType: { type: String },
    caption: { type: String },
    location: { type: String },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    }
}, { timestamps: true })

const Post = mongoose.model('posts', postSchema);
module.exports = Post;
