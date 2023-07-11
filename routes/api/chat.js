const express = require('express');
const mongoose = require('mongoose')

const router = express.Router();
const Chat = require('../../schemas/chatSchema');

router.post('/', async (req, res) => {
    const users = JSON.parse(req.body.users);
    if (users.length !== 1) {
        const userids = users.map(user => user._id)
        userids.push(req.cookies.user._id)

        Chat.create({
            users: userids,
            isgroupchat: true
        }).then(result => res.status(200).send(result))
            .catch(err => console.log(err))

    } else {
        const user = users[0]
        const chat = await Chat.find({
            users: {
                $size: 2,
                $all: [
                    { $elemMatch: { $eq: new mongoose.Types.ObjectId(user._id) } },
                    { $elemMatch: { $eq: new mongoose.Types.ObjectId(req.cookies.user._id) } }
                ]
            }
        })

        if (chat.length !== 0) {
            res.status(200).send(chat[0])
        } else {
            Chat.create({
                users: [user._id, req.cookies.user._id]
            }).then(async result => {
                res.status(200).send(result)
            })
        }
    }

})

router.get('/', async (req, res) => {
    var chats = await Chat.find({ latestmsg: { $ne: undefined }, users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(req.cookies.user._id) } } })
        .populate(['users', 'latestmsg'])
        .sort('-updatedAt');
    chats = await Chat.populate(chats, { path: "latestmsg.sender" });
    res.send(chats);
})

module.exports = router;
