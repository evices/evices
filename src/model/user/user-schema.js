'use strict';

const mongoose = require('mongoose');

const user = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'seller', 'user']
    },
    capabilities: {
        type: Array,
        default: [],
        required: true
    }
})

module.exports = mongoose.model('user', user);