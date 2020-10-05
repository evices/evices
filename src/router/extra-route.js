const express = require('express');
const router = express.Router();
const post = require('../model/post/post-collection');

router.get('/category', async (req, res, next) => {
    let result = await post.readCategory();
    res.status(200).json(result);
});

router.get('/category/:category', async (req, res, next) => {
    let category = req.params.category;
    let result = await post.readPost({category});
    res.status(200).json(result);
});

module.exports = router;