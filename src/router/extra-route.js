const express = require('express');
const router = express.Router();
const post = require('../model/post/post-collection');
const { route } = require('./api-v1');

router.get('/category', async (req, res, next) => {
    let result = await post.readCategory();
    res.status(200).json(result);
});

router.get('/category/:category', async (req, res, next) => {
    let category = req.params.category;
    let result = await post.readPost({category});
    res.status(200).json(result);
});

router.get('/bad-request', (req, res, next) => {
    res.status(500).json();
})

module.exports = router;