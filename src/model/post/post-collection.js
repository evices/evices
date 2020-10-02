'use strict';

const Model = require('../model');
const schema = require('./post-schema');

class Post extends Model {
    constructor() {
        super(schema);
    }

    pushToArray(id, record) {
        let post = this.read({_id: id});
        console.log(post);

        // post[0].comments.push(record);
        return post;
    }
}

module.exports = new Post();