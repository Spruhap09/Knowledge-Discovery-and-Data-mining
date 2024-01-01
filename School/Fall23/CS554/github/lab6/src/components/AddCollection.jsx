import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../actions';

const  AddCollection = () => {

    const dispatch = useDispatch();
    let [newCollection, setNewCollection] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const allCollections = useSelector((state) => state.collections)

    const handleChange = (e) => {
        setNewCollection(e.target.value);
        setErrorMessage('');
    }; 

    const handleSumbit = (e) => {
        e.preventDefault();
        let found = false;
        newCollection = newCollection.trim()

        allCollections.map((collection) => {
            if (collection.collectionName === newCollection){
                found = true;
            }
        })
        if (newCollection.length === 0){
            setErrorMessage('You cannot input just spaces for your collection!');
        }
        else if (!found){
            dispatch(actions.addCollection(newCollection));
            setErrorMessage('');
        }
        else{
            setErrorMessage('This collection already exists!');
        }

    }
    return (
        <form onSubmit={handleSumbit}
        style= {{marginTop: '10px', marginLeft: '10px'}}>
            <label htmlFor='collectionInput' style={{fontStyle: 'Benton Sans Extra Comp Black'}}>Add a collection: </label>
            <input
                id="collectionInput" 
                type="text"
                value={newCollection}
                onChange={handleChange}
                style ={{
                alignItems: 'center'}}
            />
            <button type="submit">Add Collection</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    )
}
export default AddCollection;