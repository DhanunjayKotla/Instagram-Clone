const express = require('express');
const User = require('../schemas/userSchema');
const Post = require('../schemas/postSchema');
const Chat = require('../schemas/chatSchema');

const router = express.Router()

router.get('/scook', (req, res) => {
    res.cookie('gowri', 'hey you man', {
        expires: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    });
    res.end()
})

router.get('/login/', (req, res) => {
    res.render('loginPage');
})
router.get('/signup/', (req, res) => {
    res.render('signupPage')
})

router.use((req, res, next) => {
    if (req.cookies.user) {
        next()
    } else {
        res.render('loginPage')
    }
})

router.get('/', async (req, res) => {
    const posts = await Post.find({ postedBy: { $in: req.cookies.user.following } }).populate('postedBy').sort('-createdAt')
    const users = await User.find({ $and: [{ _id: { $nin: req.cookies.user.following } }, { _id: { $ne: req.cookies.user._id } }] });
    res.render('home', { sugusers: users, posts, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user) });
})
router.get('/explore', async (req, res) => {
    const posts = await Post.find()
    res.render('explorePage', { posts, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user) })
})
router.get('/:username', async (req, res) => {
    const profuser = await User.findOne({ username: req.params.username });
    var posts;
    if (profuser) {
        posts = await Post.find({ postedBy: profuser._id });
        res.render('profile', { profile: true, posts, profuser, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user), profuserJs: JSON.stringify(profuser) })
    }
})
router.get('/:username/reels/', async (req, res) => {
    const profuser = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ postedBy: profuser._id });
    const reels = await Post.find({ $and: [{ postedBy: profuser._id }, { contentType: 'video' }] })
    res.render('profreelsPage', { profile: true, reels, posts, profuser, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user), profuserJs: JSON.stringify(profuser) })
})
router.get('/:username/tagged/', async (req, res) => {
    const profuser = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ postedBy: profuser._id });
    res.render('proftaggedPage', { profile: true, posts, profuser, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user), profuserJs: JSON.stringify(profuser) })
})
router.get('/:username/saved/', async (req, res) => {
    const profuser = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ postedBy: profuser._id });
    const savedposts = await Post.find({ _id: { $in: req.cookies.user.savedPosts } })
    res.render('profsavedPage', { profile: true, savedposts, posts, profuser, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user), profuserJs: JSON.stringify(profuser) })
})
router.get('/direct/inbox/', (req, res) => {
    res.render('base', { inbox: true, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user) })
})
router.get('/direct/t/:chatid', async (req, res) => {
    const chat = await Chat.findById(req.params.chatid).populate('users');
    res.render('base', { chatinJs: JSON.stringify(chat), chat, msgs: true, inbox: true, userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user) })
})
router.get('/accounts/edit/', (req, res) => {
    res.render('editPage', { userloggedin: req.cookies.user, userloggedinJs: JSON.stringify(req.cookies.user) });
})

router.get('/dcook', (req, res) => {
    res.clearCookie('gowri');
    res.end()
})

module.exports = router;
