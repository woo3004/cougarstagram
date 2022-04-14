const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const user = require('./users.js')
const User = user.model;

const postSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true 
    },
    description: { type: String, required: true },
    path: { type: String, required: true },
    likedUsers: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User',
        required: true
    },
    likes: { type: Number, required: true },
})
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    text: String,
    date: String
})

const Post = mongoose.model('Post', postSchema)
const Comment = mongoose.model('Comment', commentSchema)

router.get('/', async (req, res) => {
    try {
        let posts = await Post.find();
        res.send(posts);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:postID/comments', async (req, res) => {
    try {
        let post = await Post.findOne({
            _id: req.params.postID
        })
        if (!post) {
            res.send(404);
            return;
        }
        let comments = await Comment.find({post:post});
        res.send(comments);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let photos = await Post.find({user:req.params.id});
        res.send(photos);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});


router.post('/', async (req, res) => {
    const post = new Post({
        user: req.body.user,
        description: req.body.description,
        path: req.body.path,
        likes: 0
    });
    try {
        await post.save();
        res.send(post);
        return true;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return false;
    }
});

router.post('/:postID/comments', async (req, res) => {
    try {
        let post = await Post.findOne({
            _id: req.params.postID
        })
        if (!post) {
            res.sendStatus(404);
            return;
        }
        let comment = new Comment({
            post: post,
            text: req.body.text,
            date: req.body.date,
            // user: req.body.user,
        })
        await comment.save();
        res.send(comment);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//like
router.put('/:id', async(req, res) => {
    try {
        let post = await Post.findOne({
            _id: req.params.id
        })
        if (post.likedUsers.find(user => user == req.body.user)) return;
        post.likedUsers.push(req.body.user)
        post.likes++
        await post.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:id', async(req, res) => {
    try {
        await Post.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
    model: Post,
    model: Comment
};