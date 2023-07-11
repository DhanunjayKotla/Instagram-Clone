const express = require('express')
const Comment = require('../../schemas/commentSchema');

const router = express.Router()

router.post('/', async (req, res) => {
    const comment = await Comment.create(req.body)
    comment.populate('postedBy')
        .then(result => res.send(result))
        .catch(err => console.log(err.message))
})
router.get('/', async (req, res) => {
    var res1 = await Comment.find({ commentTo: req.query.postid, postedBy: req.cookies.user._id }).populate('postedBy').sort('-createdAt');
    const res2 = await Comment.find({ commentTo: req.query.postid, postedBy: { $ne: req.cookies.user._id } }).populate('postedBy');
    res1 = [...res1, ...res2];
    res.send(res1);
})


module.exports = router;
