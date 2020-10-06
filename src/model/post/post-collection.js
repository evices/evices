'use strict';

const Model = require('../model');
const schema = require('./post-schema');

class Post extends Model {
    constructor() {
        super(schema);
    }

    // pushToArray(id, record) {
    //     let post = this.read({_id: id});
    //     console.log(post);

    //     // post[0].comments.push(record);
    //     return post;
    // }

    async patch(_id, record) {
        let pat = this.schema.findByIdAndUpdate(_id, record, {
            new: true,
        });
        this.getRateAVG({
            _id: _id
        });
        return pat;
    }

    async readCategory() {
        let result = await this.schema.distinct('category');
        return result;
    }

    async readPost(category = null, lmt = null) {
        let queryParam = category ? category : {};
        let result = this.schema.find(queryParam).sort({"rateAVG": -1}).limit(lmt);
        return result;
    }

    async getRateAVG(_id) {
        let queryParam = _id ? _id : {};
        let avg = await this.schema.find(queryParam);

        let comment = avg[0].comments;

        let rateArray = [];
        let sum = 0;
        comment.forEach(ele => {
            sum += ele.rate;
            rateArray.push(ele.rate);
        });
        let avarage = sum / rateArray.length;

        let update = this.schema.findByIdAndUpdate(_id, {
            "rateAVG": avarage
        });

        return update;
    }
}

module.exports = new Post();