import storage from 'redux-persist/lib/storage';

const persist = {
    key: 'root', //the key
    storage: storage, //this is the storage
    whitelist: ['collections', 'selection']
}

export default persist;