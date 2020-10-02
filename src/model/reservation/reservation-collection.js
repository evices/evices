'use strict';

const Model = require('../model');
const schema = require('./reservation-schema');

class Reservation extends Model {
    constructor() {
        super(schema);
    }

}

module.exports = new Reservation();