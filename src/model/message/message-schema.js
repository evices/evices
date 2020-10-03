'use strict';

const mongoose = require('mongoose');

const messages = mongoose.Schema({
    receiver_name: String,
    sender_name: String,
    message_text: String,
    is_deleted: Boolean,
    created_date: { type: Date, default: Date.now() }
 });
 

module.exports = mongoose.model('messages', messages);