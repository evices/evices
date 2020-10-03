'use strict';

const mongoose = require('mongoose');

const messages = mongoose.Schema({
    receiver_name: String,
    sender_name: String,
    message_text: String,
    is_deleted: Boolean,
    created_date: { type: Date, default: Date.now() }
 });
 
//Shard on "recipient" and "sent"
db.shardCollection("mongodbdays.inbox", {"recipient": 1, "sent":1})

msg = {
  from: "Joe",
  to: ["Bob", "Jane"]
  sent: new Date()
  message: "Hi!", 
}

//Send a message
for (recipient in msg.to){
  msg.recipient = msg.to[recipient]
  db.inbox.insert(msg);
}

//Read Bob's inbox
db.inbox.find ({recipient: "Bob"}).sort({ sent:-1})

module.exports = mongoose.model('messages', messages);