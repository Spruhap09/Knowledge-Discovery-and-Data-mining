import AddCollection from "./AddCollection"
import SelectCollection from "./SelectCollection"
import {useDispatch,  useSelector} from 'react-redux';
import * as actions from '../actions';
import Comic from "./Comic";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button
} from '@mui/material';

const Collection = () => {

    const dispatch = useDispatch();
    const allCollections = useSelector((state) => state.collections);
    const selectedCollection = useSelector((state) => state.selection);

    console.log('This is allCollections')
    console.log(allCollections)

    console.log('This is the selected collection')
    console.log(selectedCollection)
    

    const handleDeleteCollection = (collectionName) => {
        if(collectionName === selectedCollection.collectionName){
            dispatch(actions.deleteSelectionCollection(collectionName))
        }
        dispatch(actions.deleteCollection(collectionName))
    }
    if (selectedCollection && selectedCollection.length === 0){
        return(
            <div>
                <AddCollection />
                <SelectCollection />
            </div>
        )
    }
    return (
        <div>
            <div style={{textAlign: 'center', fontFamily: 'Benton Sans Extra Comp Black', fontWeight: 'bold'}}>
                <AddCollection />
                <SelectCollection />
            </div>
            {allCollections.map((collection) => (
                <div key={collection.collectionName}
                style={{ 
                        margin: '20px', 
                        marginTop: '30px', 
                        marginBottom: '40px',
                        borderColor: '#FF171F',
                        border: 'solid'}}>
                    <h2 style={{textAlign: 'center', fontFamily: 'Benton Sans Extra Comp Black'}}>{collection.collectionName}</h2>
                    {selectedCollection[0].collectionName !== collection.collectionName && (
                        <Button onClick={() => handleDeleteCollection(collection.collectionName)}>
                            Delete This Collection
                        </Button>
                    )}
                    {collection.collection && (collection.collection.length > 0) ? (
                        <Grid container spacing={2}>
                            {collection.collection.map((comic) => <Comic key={comic.id} comicId = {comic.id}/>)}
                        </Grid>
                    ) : (
                        <p>No comics present for this collection</p>
                    )}
                    
                </div>
            ))}
        </div>
    )
}
export default Collection;