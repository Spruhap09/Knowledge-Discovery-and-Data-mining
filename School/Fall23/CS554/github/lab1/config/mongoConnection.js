// //const MongoClient = require('mongodb').MongoClient;
// import MongoClient from 'mongodb';
// import settings from './settings.json' assert {type: 'json'};
// //const settings = require('./settings');
// const mongoConfig = settings.mongoConfig;

// let _connection = undefined;
// let _db = undefined;

// const module = {
//   dbConnection: async () => {
//     if (!_connection) {
//       _connection = await MongoClient.connect(mongoConfig.serverUrl);
//       _db = await _connection.db(mongoConfig.database);
//     }

//     return _db;
//   },
//   closeConnection: () => {
//     _connection.close();
//   }
// };

// export default module;

import {MongoClient} from 'mongodb';
const settings = {
  mongoConfig: {
    serverUrl: 'mongodb://127.0.0.1:27017/',
    database: 'Paradkar-Spruha-CS554-Lab1'
  }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export {dbConnection, closeConnection};