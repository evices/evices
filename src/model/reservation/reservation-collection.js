'use strict';

const { Schema } = require('mongoose');
const Model = require('../model');
const schema = require('./reservation-schema');
const user=require('../user/user-schema');


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
        const capcity=await user.find({_id:record.provider_id});
        console.log('capacity',capcity);

        if (result.length >= capcity[0].capcity) {
            throw Error('This job already booked and approved');
        } else {

            let savedRecord = new schema(record);
            savedRecord.save();
            return savedRecord;
        }
    }

}

module.exports = new Reservation();