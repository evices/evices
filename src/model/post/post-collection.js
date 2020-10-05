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

    async readCategory() {
        let result = await this.schema.distinct('category');
        return result;
    }

    async readPost(category = null) {
        let queryParam = category ? category : {};
        let result = this.schema.find(queryParam);
        return result;
    }
}

module.exports = new Post();