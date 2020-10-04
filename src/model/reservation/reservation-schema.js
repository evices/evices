'use strict';

const mongoose = require('mongoose');

const reservation = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    provider_id: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    book_date: {
        type: Date,
        required: true
    },
    is_approved: {
        type: Number,
        enum: [0, 1, 2],
        required: true,
        default: 0
        //(0 = pending, 1 = approved, 2 = declined),

    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('reservation', reservation);
