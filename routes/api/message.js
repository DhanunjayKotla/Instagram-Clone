const express = require('express');
const mongoose = require('mongoose');
const Message = require('../../schemas/messageSchema');
const Chat = require('../../schemas/chatSchema');

const router = express.Router();

router.post('/', (req, res) => {
    Message.create({
        content: req.body.content,
        chat: req.body.chatid,
        sender: req.cookies.user._id
    }).then(async result => {
        Chat.findByIdAndUpdate(req.body.chatid, { latestmsg: result._id }, { new: true })
            .catch(err => console.log(err.message))
        result = await result.populate(['chat', 'sender'])
        res.status(200).send(result)
    })
        .catch(err => console.log(err.message))
})

router.post('/postmsg', async (req, res) => {
    var selectedusers = JSON.parse(req.body.selectedusers)
    var chatid;

    selectedusers.forEach(async user => {

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
            chatid = chat[0]._id;
        } else {
            var chat2 = await Chat.create({ users: [user._id, req.cookies.user._id] })
            chatid = chat2._id;
        }

        Message.create({
            content: req.body.content,
            chat: chatid,
            sender: req.cookies.user._id,
            post: true
        }).then(async result => {
            Chat.findByIdAndUpdate(chatid, { latestmsg: result._id }, { new: true })
                .catch(err => console.log(err.message))
            result = await result.populate(['chat', 'sender'])
        })
            .catch(err => console.log(err.message))
    })

    res.send('success');
})

router.get('/', (req, res) => {
    Message.find({ chat: req.query.chatid }).populate('sender')
        .then(result => res.send(result))
        .catch(err => console.log(err.message))
})

module.exports = router;
