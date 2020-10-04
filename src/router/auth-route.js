const express = require('express');
const router = express.Router();
const user = require('../model/user/user-collection');
const auth = require('../middleware/authorization');
const oauth = require('../middleware/oauth');

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
router.patch('/update/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('req.body====>', req.body);
    try {
        user.patch(id, req.body).then(result => {
          
            res.status(201).json(result);
        }).catch(next);
    } catch (e) {
        res.status(403).send('Error');
    }
});

router.get('/google', (req, res) => {
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
    res.status(200).json({
        token: req.token,
        user: req.user
    });
});

module.exports = router;