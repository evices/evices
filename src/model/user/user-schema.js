'use strict';

const mongoose = require('mongoose');

const address = mongoose.Schema({
    address: String,
    phone: String
});

const user = mongoose.Schema({
    fullname: {
        type: String,
    },
    phone: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: [address],
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'seller', 'user']
    },
    capabilities: {
        type: Array,
        default: [],
        required: true
    },
    capcity: {
        type: Number,
        default: 5
    }
})

module.exports = mongoose.model('user', user);