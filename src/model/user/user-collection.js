'use strict';

const Model = require('../model');
const schema = require('./user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MINUTES = 15;

class User extends Model {
    constructor() {
        super(schema);
    }

    async save(record) {
        console.log(record);
        try {
            const result = await this.read({
                username: record.username,
            });

            console.log(result.length);

            if (result.length === 0) {
                console.log(result);

                const newRecord = new this.schema(record);
                newRecord.password = await bcrypt.hash(newRecord.password, 5);
                console.log('new record:', newRecord);

                const roleMap = {
                    user: 1,
                    seller: 3,
                    admin: 4,
                };

                const capabilities = ['read', 'create', 'update', 'delete'];
                const allowedForThisUser = [];
                for (let i = 0; i < roleMap[newRecord.role]; i++) {
                    allowedForThisUser.push(capabilities[i]);
                }
                newRecord.capabilities = allowedForThisUser;

                return this.create(newRecord);
            } else {
                let token = this.generateToken(result[0]);
                return {
                    token,
                    result,
                };
            }
        } catch (err) {
            return err;
        }
    }

    generateToken(user) {
        // console.log(user);
        const signed =  jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role,
            capabilities: user.capabilities,
            expiresIn: 900000,
        }, process.env.SECRET);
        return signed;
    }

    async comparePasswords(user, password) {
        console.log(password);
        console.log(user.password);
        let valid = await bcrypt.compare(password, user.password);
        return valid ? this : Promise.reject();
    }

    async authenticateToken(token) {
        console.log(token);

        try {
            let tokenObject = jwt.verify(token, process.env.SECRET);

            if (Date.now() / 1000 - tokenObject.iat > 60 * MINUTES) {
                return Promise.reject('Token expired');
            }

            if (tokenObject.username) {
                let inDb = await this.read({username: tokenObject.username});
                return inDb ? Promise.resolve(inDb[0]) : Promise.reject();
            } else {
                return Promise.reject();
            }

        } catch (e) {
            // console.log(e);
            return Promise.reject();
        }
    }

    async authenticateBasic(username, password) {
        let query = {
            username,
        };

        let user = await this.read(query);
        user = user[0];

        if (!user) {
            return null;
        }

        console.log('user',user);

        let compare = await this.comparePasswords(user, password);

        console.log('compare',compare);

        if (user && compare) {
            let signed = await this.generateToken(user);
            return {
                token: signed,
                user: user,
            };
        } else {
            return Promise.reject();
        }
    }

}

module.exports = new User();