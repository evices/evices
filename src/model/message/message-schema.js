'use strict';

const mongoose = require('mongoose');

const messages = mongoose.Schema({
    receiver_name: String,
    sender_name: String,
    message_text: String,
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    is_deleted: Boolean,
    created_date: { type: Date, default: Date.now() }
 });
 

module.exports = mongoose.model('messages', messages);