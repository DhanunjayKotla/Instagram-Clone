const express = require('express')
const multer = require('multer')
const alert = require('alert');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const User = require('../../schemas/userSchema');

const firebase = require("firebase/app")
const firebasestorage = require("firebase/storage");
const config = require("../../firebaseconfig")

firebase.initializeApp(config);
const storage = firebasestorage.getStorage();
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('File is not allowed'))
        }
        cb(null, true)
    }
}).single('Image')

const router = express.Router();

router.get('/', (req, res) => {
    User.find({
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } }
        ]
    }).then(results => res.status(200).send(results))
        .catch(err => console.log(err.message))
})

router.get('/followers', (req, res) => {
    User.findById(req.query.userid).populate('followers')
        .then(result => res.send(result.followers))
        .catch(err => console.log(err.message))
})

router.get('/following', (req, res) => {
    User.findById(req.query.userid).populate('following')
        .then(result => res.send(result.following))
        .catch(err => console.log(err.message))
})

router.put('/updatesaved', async (req, res) => {
    var user = await User.findById(req.cookies.user._id)
    var issaved = user.savedPosts && user.savedPosts.includes(req.body.postid)
    var option = issaved ? '$pull' : '$addToSet';

    user = await User.findByIdAndUpdate(req.cookies.user._id, { [option]: { savedPosts: req.body.postid } }, { new: true })
        .catch(error => {
            console.log(error.message);
            res.sendStatus(400);
        })

    res.cookie('user', user, { httpOnly: true });
    res.send(user);
})

router.put('/uploadprofile', async (req, res) => {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            $('.loading').css({ display: 'none' })
            alert(`${err.message}. Refresh page!`);
        } else if (err) {
            $('.loading').css({ display: 'none' })
            alert(`${err.message}. Refresh page!`)
        } else {
            var profpic = req.cookies.user.profilePic;
            try {
                const dateTime = giveCurrentDateTime();
                const storageRef = firebasestorage.ref(storage, `files/${req.file.originalname + " " + dateTime}`);
                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await firebasestorage.uploadBytesResumable(storageRef, req.file.buffer, metadata);
                const downloadURL = await firebasestorage.getDownloadURL(snapshot.ref);
                var user = await User.findByIdAndUpdate(req.cookies.user._id, { profilePic: downloadURL }, { new: true });
                if (profpic != '/images/profilepic.webp') {
                    const desertRef = firebasestorage.ref(storage, profpic);
                    await firebasestorage.deleteObject(desertRef)
                }
                res.cookie('user', user, { httpOnly: true });
                res.send(user);
            } catch (err) {
                console.log(err)
            }
        }
    })
})
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

router.put('/updatefollowing', async (req, res) => {
    var user = await User.findById(req.body.userid)
    var isFollowing = user.followers && user.followers.includes(req.cookies.user._id)
    var option = isFollowing ? '$pull' : '$addToSet';

    user = await User.findByIdAndUpdate(req.cookies.user._id, { [option]: { following: req.body.userid } }, { new: true })
        .catch(error => {
            console.log(error.message);
            res.sendStatus(400);
        })

    User.findByIdAndUpdate(req.body.userid, { [option]: { followers: req.cookies.user._id } })
        .catch(error => {
            console.log(error.message);
            res.sendStatus(400);
        })

    res.cookie('user', user, { httpOnly: true });
    res.send(user);
})

router.post('/updateDetails', async (req, res) => {
    var user = await User.findByIdAndUpdate(req.cookies.user._id, req.body, { new: true });
    res.cookie('user', user, { httpOnly: true });
    res.redirect(`/${user.username}`)
})

router.post('/signup', async (req, res) => {
    const user = await User.create(req.body);
    res.cookie('user', user, { httpOnly: true });
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
        res.cookie('user', user, { httpOnly: true });
        res.redirect('/')
    } else {
        var payload = req.body;
        payload.errormsg = 'Incorrect credentials'
        res.render('loginPage', payload);
    }
})

module.exports = router;
