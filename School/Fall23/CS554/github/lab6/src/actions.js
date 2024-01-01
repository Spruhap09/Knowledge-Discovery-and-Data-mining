const addCollection = (collectionName)=> ({
    type: 'ADD_COLLECTION',
    payload: {
        collectionName: collectionName, 
    }
}); 

const addComicFromCollection = (collectionName, comic) => ({
    type: 'ADD_COMIC',
    payload: {
        collectionName: collectionName, 
        comic: comic
    }
});

const removeComicFromCollection = (collectionName, comic) => ({
    type: 'REMOVE_COMIC', 
    payload: {
        collectionName: collectionName,
        comic: comic
    }
});

const deleteCollection = (collectionName) => ({
    type: 'DELETE_COLLECTION', 
    payload: {
        collectionName: collectionName
    }
});

// const selectionCollection = (collectionName, selected) => ({
//     type: 'SELECT_COLLECTION',
//     payload: {
//         collectionName: collectionName,
//         selected: selected
//     }
// })

const selectionCollection = (collectionName) => ({
    type: 'ADD_SELECTED',
    payload: {
        collectionName: collectionName
    }
})
const deleteSelectionCollection = (collectionName) => ({
    type: 'DELETE_SELECTED',
    payload: {
        collectionName: collectionName
    }
})


export {addCollection, addComicFromCollection, removeComicFromCollection, deleteCollection, selectionCollection, deleteSelectionCollection};