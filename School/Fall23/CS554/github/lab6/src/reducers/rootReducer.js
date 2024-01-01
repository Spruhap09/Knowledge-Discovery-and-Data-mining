import { combineReducers } from 'redux';
import collectionReducer from './collectionReducer';
import selectionReducer from './selectionReducer';
import { persistReducer } from 'redux-persist';
import persist from '../persist';
// import persistReducer from 'redux-persist/es/persistReducer';

const rootReducer = combineReducers({
  collections: collectionReducer,
  selection: selectionReducer,
});

const myPersistReducer = persistReducer(persist, rootReducer)

export default myPersistReducer;