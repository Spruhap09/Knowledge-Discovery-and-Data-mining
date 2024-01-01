let copyState = null;
let index = 0;

const initialState = [{
    collectionName: 'myPersonalSubCollection'
}]

const selectionReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type) {
        case 'ADD_SELECTED':
            return [
                {
                    collectionName: payload.collectionName
                }
            ];
        case 'DELETE_SELECTED':
            return []
        default:
            return state;
    }
}
export default selectionReducer;