const express = require('express');
const router = express.Router();
const user = require('../model/user/user-collection');
const auth = require('../middleware/authorization');

router.post('/signup', async (req, res, next) => {
    try {
        user.save(req.body).then(result => {
            let token = user.generateToken(result);
            res.body = {
                result,
                token
            };
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
router.put('/:id', (req, res, next) => {
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

module.exports = router;