const express = require('express');
const router = express.Router();
const post = require('../model/post/post-collection');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname); //Appending extension
    }
  })
  
  var upload = multer({ storage: storage });
  
const {
    route
} = require('./api-v1')

/* istanbul ignore next */ 
var fs = require('fs'),
http = require('http'),
    sio = require('socket.io');

/* istanbul ignore next */ 
var usernames = {};
var sockets = {};
var names = {};

/* istanbul ignore next */ 
var server = http.createServer(function (req, res) {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    res.end(fs.readFileSync('./public/index.html'));
  });
  server.listen(3001, function () {
    console.log('Server listening');
  });
  
/* istanbul ignore next */ 
io = sio.listen(server);
/* istanbul ignore next */ 
io.on('connection', function (socket) {
    socket.on('send_msg', function (msg) {
        console.log('a user connected');
        io.emit('chat message', msg);
        //console.log(msg);

    });

    socket.on('new_user', function (user) {
        console.log('new user:' + user);
        names[socket.id] = user;
        socket.nickname = user;
        usernames[socket.nickname] = socket;
        sockets[user] = socket.id;
        socket.emit('update_personal', "you are now online");
        io.emit('update_users', names);

    });

    socket.on('disconnect', function () {

        io.emit('update_personal', socket.nickname + ' is now offline');
        delete names[socket.id];
        delete usernames[socket.nickname];
        io.emit('update_users', names);
        //console.log(usernames+'specific user id'+usernames[user]);
    });

    socket.on('private_msg', function (msg, recipient, sender) {

        console.log('you are trying to send ' + msg + ' to ' + recipient + ' from ' + sender);


        var id = sockets[recipient];

        console.log(sockets[recipient]);
        io.to(id).emit('received_p_msg', msg, sender, recipient);

        recipient = '';
        console.log('value in recipient:' + recipient);
    });
});

/* istanbul ignore next */ 
router.get('/', async (req, res, next) => {
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    res.end(fs.readFileSync('./public/index.html'));
});

router.get('/category', async (req, res, next) => {
    let result = await post.readCategory();
    res.status(200).json(result);
});

router.get('/category/:category', async (req, res, next) => {
    let category = req.params.category;
    let result = await post.readPost({
        category
    });
    res.status(200).json(result);
});

router.post('/upload', upload.single('photo'), (req, res) => {
    console.log(req)
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});


router.get('/bad-request', (req, res, next) => {
    res.status(500).json();
})

module.exports = router;