//const mongoCollections = require('../config/mongoCollections');
// import mongoCollections from '../config/mongoCollections.js';
// const users = mongoCollections.users;
import {users} from '../config/mongoCollections.js';
//const {ObjectId} = require('mongodb');
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs'
//const bcrypt = require('bcryptjs');
import validation from '../validation.js'
//const validation = require('../validation');
const saltRounds = 8;

const user = {

    async createUser(name, userName, password){
        
        
        try{
            name = validation.checkName(name, 'name');
            userName = validation.checkUsername(userName, 'username');
            //userNameTemp = userName.toLowerCase();
            const userCollection = await users();
            const myUser = await userCollection.findOne({username: userName});
            if (myUser){
                    throw "Error: This username already exists";
            }
            password = validation.checkPassword(password, 'password');
            const hash = await bcrypt.hash(password, saltRounds);
            const newUser = {
                name: name,
                username: userName,
                password: hash
            };
            const id = await userCollection.insertOne(newUser);
            if (!id.insertedId) throw 'Insert failed!';
            return {_id: id.insertedId, name: name, username: userName};
        }
        catch(e){
            throw e;
        }
    }, 

    async getUserByUsername(username, password) {

        try{
            username = validation.checkUsername(username, 'username');
            username = username.toLowerCase(); 
            password = validation.checkPassword(password, 'password');
            const userCollection = await users();
            const myUser = await userCollection.findOne({username: username}); 
            if (!myUser) {
                throw "Error: Either the username or password is invalid"
            };
            let authetication = false;
            authetication = await bcrypt.compare(password, myUser.password);
            if (!authetication){
                throw "Error: Either the username or password is invalid"
            }
            return {_id: myUser._id, name: myUser.name, username: myUser.username};
        }
        catch(e){
            throw e;
        }
    }
}

export default user;