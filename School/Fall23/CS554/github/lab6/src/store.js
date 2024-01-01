import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {composeWithDevTools} from '@redux-devtools/extension';
import myPersistReducer from './reducers/rootReducer';
import { persistStore } from 'redux-persist';
//import persist from './persist';

const store = configureStore({
    reducer: myPersistReducer, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })}, 
    composeWithDevTools());
export const persistor = persistStore(store);
export default store;