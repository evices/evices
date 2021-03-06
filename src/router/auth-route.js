const express = require('express');
const router = express.Router();
const user = require('../model/user/user-collection');
const post = require('../model/post/post-collection');
const auth = require('../middleware/authorization');
const oauth = require('../middleware/oauth');
const { route } = require('./api-v1');

router.post('/signup', async (req, res, next) => {
    console.log(req.body)
    try {
        user.save(req.body).then(result => {
            let token = user.generateToken(result);
            res.body = {
                result,
                token
            };
            console.log('sign',res.body)
            res.status(201).send({
                token,
                result
            });
        });
    } catch (e) {
        /* istanbul ignore next */ 
        res.status(403).send('Error creating user');
    }
});

router.post('/signin', auth, (req, res, next) => {
    res.cookie('auth', req.token);
    res.status(200).json({
        token: req.token,
        user: req.user
    });
});

router.get('/google', (req, res) => {
    post.getRateAVG({_id : "5f7c299d16dee4a8503f9d4c"});
    let URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    let options = {
        response_type: 'code',
        client_id: '82394101385-jaqm9i6p3cdu3i374lgg1b9ao6gfnpe3.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/oauth',
        scope: 'openid email',
        state: 'http://localhost',
        access_type: 'offline',
    }

    let QueryString = Object.keys(options).map((key) => {
        return `${key}=` + encodeURIComponent(options[key]);
    }).join("&");

    let authURL = `${URL}?${QueryString}`;

    res.send(`<a href=${authURL}>Login</a>`);
});

router.get('/oauth', oauth, async (req, res) => {
    /* istanbul ignore next */ 
    res.status(200).json({
        token: req.token,
        user: req.user
    });
});

module.exports = router;