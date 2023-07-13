const express = require('express');
const multer = require('multer');
const alert = require('alert');
const path = require('path')
const fs = require('fs');
const Post = require('../../schemas/postSchema');

const firebase = require("firebase/app")
const firebasestorage = require("firebase/storage");
const config = require("../../firebaseconfig")

firebase.initializeApp(config);
const storage = firebasestorage.getStorage();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }).single('croppedImage');

const router = express.Router();

router.get('/', (req, res) => {
    Post.findById(req.query.postid).populate('postedBy')
        .then(result => res.send(result))
        .catch(err => console.log(err.message))
})

router.post('/', (req, res) => {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            $('.loading').css({ display: 'none' })
            alert(`${err.message}. Refresh page!`);
        } else if (err) {
            $('.loading').css({ display: 'none' })
            alert(`${err.message}. Refresh page!`)
        } else {
            try {
                const dateTime = giveCurrentDateTime();
                const storageRef = firebasestorage.ref(storage, `files/${req.file.originalname + " " + dateTime}`);
                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await firebasestorage.uploadBytesResumable(storageRef, req.file.buffer, metadata);
                const downloadURL = await firebasestorage.getDownloadURL(snapshot.ref);

                var contentType
                if (req.file.mimetype.startsWith('image')) {
                    contentType = 'image'
                } else if (req.file.mimetype.startsWith('video')) {
                    contentType = 'video'
                }

                Post.create({
                    postPic: downloadURL,
                    caption: req.body.caption,
                    location: req.body.location,
                    postedBy: req.cookies.user._id,
                    contentType: contentType
                }).catch(err => console.log(err.message));

                res.send('success')
            } catch (err) {
                console.log(err.message)
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

router.put('/updatelikes', async (req, res) => {

    var post = await Post.findById(req.body.postid)
    var isliked = post.likedBy && post.likedBy.includes(req.cookies.user._id)
    var option = isliked ? '$pull' : '$addToSet';

    Post.findByIdAndUpdate(req.body.postid, { [option]: { likedBy: req.cookies.user._id } }, { new: true })
        .then(result => res.send(result))
        .catch(error => {
            console.log(error.message);
            res.sendStatus(400);
        })

})

module.exports = router;
