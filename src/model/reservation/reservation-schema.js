'use strict';

const mongoose = require('mongoose');

const reservation = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    provider_id: {
        type: String,
        require: true
    },
    post_id: {
        type: String,
        require: true
    },
    book_date: {
        type: Date,
        require: true
    },
    is_approved: {
        type: Number,
        enum: [0, 1, 2],
        require: true,
        default: 0
        //(0 = pending, 1 = approved, 2 = declined),

    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('reservation', reservation);
