'use strict';

class Model {

  /**
     * 
     * @param {Object} schema mongo schema 
     */
  constructor(schema) {
    this.schema = schema;
  }

  /**
     * 
     * @param {String} _id optional for mongo record id
     * @return {*} return record by id if _id !empty else will get all records 
     */
  read(_id) {
    let queryParam = _id ? _id : {};
    return this.schema.find(queryParam)
                      .populate('postedBy', 'username _id fullname phone')
                      .populate('client', 'username fullname _id address')
                      .populate('provider', 'username fullname _id')
                      .populate('post', '_id title')
                      .populate('receiver_id', '_id fullname username user_image')
                      .populate('sender_id', '_id fullname username user_image');
  }

  /**
     * 
     * @param {Object} record must match schema format
     * @return {*} 
     */
  create(record) {
    let queryRecord = this.schema(record);
    return queryRecord.save(record);
  }

  /**
     * 
     * @param {String} _id mongo record id
     * @param {Object} record must match schema format
     * @return {*}
     */
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {
      new: true,
    });
  }

  /**
     * 
     * @param {String} _id mongo record id
     * @param {Object} record must match schema format
     * @return {*}
     */
  patch(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {
      new: true,
    });
  }

  /**
     * 
     * @param {String} _id mongo record id
     * @return {*}
     */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = Model;
