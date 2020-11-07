'use strict';

const mongoose = require('mongoose');

const comments = mongoose.Schema({
    username: String,
    comments: String,
    rate: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

const post = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    porviderId: {
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
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [comments],
    rateAVG: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
});



module.exports = mongoose.model('post', post);
