'use strict';

const {
    Schema
} = require('mongoose');
const Model = require('../model');
const schema = require('./reservation-schema');
const user = require('../user/user-schema');
const post = require('../post/post-collection');

class Reservation extends Model {
    constructor() {
        super(schema);
    }

    async create(record) {
        console.log(record);
        let result = await this.read({
            post_id: record.post_id,
            is_approved: 1,
            book_date: record.book_date
        });

        let postCategory = await post.read({_id: record.post_id});

        // console.log(postCategory[0]);

        let suggestionResult = await post.readPost({category: postCategory[0].category,  _id: {$ne: record.post_id }});

        // console.log(suggestionResult);

        const capcity = await user.find({
            _id: record.provider_id
        });
        console.log('capacity', capcity);

        if (result.length >= capcity[0].capcity) {
            let obj = {
                "message": "This job already booked and approved",
                "sugesstion" : suggestionResult
            };
            return obj;
            // throw Error('This job already booked and approved');
        } else {

            let savedRecord = new schema(record);
            savedRecord.save();
            return savedRecord;
        }
    }

    async patch(_id, record) {
        console.log(_id);

        let postResult = await this.read({ _id });
        
        console.log(postResult);

        if(postResult[0].provider_id === record.current_user_id || postResult[0].user_id === record.current_user_id) {
            let newRecord = this.schema.findByIdAndUpdate(_id, record, {
                new: true,
            });
            return newRecord;
        } else {
            return {"message": "No permissions"};
        }
    }

}

module.exports = new Reservation();