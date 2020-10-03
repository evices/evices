
'use strict';

const Model = require('../model');
const schema = require('./messaage-collection');

class Messaage extends Model {
    constructor() {
        super(schema);
    }

}

module.exports = new Messaage();
