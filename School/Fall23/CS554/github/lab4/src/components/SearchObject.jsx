import React, { useState } from 'react';

const SearchObject = (props) => {
    const [searchTerm, setSearchTerm] = useState(undefined);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
        
    // };

    const handleChange = (e) => {
      //props.searchValue(e.target.value);
      setSearchTerm(e.target.value)
    };
    return (
      <form
        method='POST'
        onSubmit={(e) => {
          e.preventDefault();
          props.searchValue(searchTerm);
        }}
        name='formName'
        className='center'
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: 'Times New Roman', 
                fontWeight: 'bold', 
                textAlign: 'center',
                fontSize: '20px'
            }}>Search Object:  </span>
          <input
            autoComplete='off'
            type='text'
            name='searchTerm'
            onChange={handleChange}
            style={{border: '2px solid black', marginRight: '10px'}}
          />
          <button type="submit">Search</button>
        </div>
        <br/>
      </form>
    );
  };
  
  export default SearchObject;