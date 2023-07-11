const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    password: { type: String },
    profilePic: {
        type: String,
        default: '/images/profilepic.webp'
    },
    gender: { type: String },
    bio: { type: String },
    savedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'posts'
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    }
})

const User = mongoose.model('users', userSchema);
module.exports = User;
