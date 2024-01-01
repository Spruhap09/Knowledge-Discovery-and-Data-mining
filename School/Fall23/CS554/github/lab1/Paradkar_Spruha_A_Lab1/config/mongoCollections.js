// //const dbConnection = require('./mongoConnection');
// import dbConnection from './mongoConnection.js'

// /* This will allow you to have one reference to each collection per app */
// /* Feel free to copy and paste this this */
// const getCollectionFn = (collection) => {
//   let _col = undefined;

//   return async () => {
//     if (!_col) {
//       const db = await dbConnection.dbConnection();
//       _col = await db.collection(collection);
//     }

//     return _col;
//   };
// };

// /* Now, you can list your collections here: */
// const module = {
//   users: getCollectionFn('users'),
//   reviews: getCollectionFn('reviews')
// };

// export default module;

import {dbConnection} from './mongoConnection.js';

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};
// const module = {
//   users: getCollectionFn('users'),
//   reviews: getCollectionFn('reviews')
// };

export const recipes = getCollectionFn('recipes');
export const users = getCollectionFn('users');
