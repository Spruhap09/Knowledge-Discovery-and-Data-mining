let copyState = null;
let index = 0;

const initialState = [{
    collectionName: 'myPersonalSubCollection',
    collection: []
}]
const collectionReducer = (state= initialState, action) => {

    const {type, payload} = action;
    switch(type) {
        case 'ADD_COLLECTION':
            console.log(`This is the payload from add collection ${payload}`)

            return [
                ...state, 
                {
                    collectionName: payload.collectionName,
                    collection: []
                }
            ];

        case 'DELETE_COLLECTION':
            console.log(`This is the payload from delete collection ${payload}`)
            copyState = [...state];
            index = copyState.findIndex((x) => x.collectionName === payload.collectionName);
            copyState.splice(index, 1);
            return[...copyState];

        case 'ADD_COMIC':
            return state.map((collectionObject) => {
                if (collectionObject.collectionName === payload.collectionName){
                    return {
                        ...collectionObject, 
                        collection: [...collectionObject.collection, payload.comic]
                    };
                }
                else{
                    return collectionObject;
                }
            });

        case 'REMOVE_COMIC':
            return state.map((collectionObject) => {
                if (collectionObject.collectionName === payload.collectionName){
                    const updatedCollection = collectionObject.collection.filter((comic) =>
                        comic.id !== payload.comic.id
                    );
                    return {
                        ...collectionObject,
                        collection: updatedCollection
                    };
                }
                else{
                    return collectionObject;
                }
            })
        default:
            return state;
        
        // case 'SELECT_COLLECTION':
        //     return state.map((collectionObject) => {
        //         if (collectionObject.collectionName === payload.collectionName){
        //             return {
        //                 ...collectionObject,
        //                 selected: payload.selected
        //             };
        //         }
        //         else{
        //             return collectionObject;
        //         }
        //     })
    }
}

export default collectionReducer;