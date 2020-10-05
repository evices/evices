
'use strict';

const Model = require('../model');
const schema = require('./message-schema');

class Messaage extends Model {
    constructor() {
        super(schema);
    }

}

module.exports = new Messaage();
