'use strict';

const mongoose = require('mongoose');

const comments = mongoose.Schema({
    username: String,
    comments: String,
    created_date: { type: Date, default: Date.now() }
 });

const post = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['TECH', 'CARPENTER']
    },
    comments: [comments],
});



module.exports = mongoose.model('post', post);