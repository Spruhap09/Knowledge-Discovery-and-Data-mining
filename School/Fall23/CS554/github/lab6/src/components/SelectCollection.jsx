import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../actions';

// //allows you to select a collection and set it as the selected collection
// //allows you to add or delete a collection
// //shows you the data for all the respective collections
const SelectCollection = () => {

    const dispatch = useDispatch();
    const [selectedCollection, setSelectedCollection] = useState('');
    const allCollections = useSelector((state) => state.collections)
 
    const handleChange = (e) => {
        setSelectedCollection(e.target.value);
        dispatch(actions.selectionCollection(e.target.value));
    }; 

    return (
        <div className='collection-wrapper collections'
        style= {{marginLeft: '10px'}}>
            <label>Select a Collection: </label>
            <select
            value = {selectedCollection}
            onChange={handleChange}>
                <option value="">Select One</option>
                {allCollections.map((collection) => (
                    <option key={collection.collectionName} value={collection.collectionName}>
                        {collection.collectionName}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectCollection;
