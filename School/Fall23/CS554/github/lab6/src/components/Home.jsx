import React from 'react';
import { Route, Link, Routes} from 'react-router-dom';

const Home = (props) => {
    return (
        <div>
            <h2 style=
                {{textAlign: 'center', 
                fontStyle: 'oblique', 
                fontFamily: 'Benton Sans Extra Comp Black',
                fontSize: '25px'}}>
                Welcome to the Marvel API Home Page
            </h2>
            <div 
            style={{height: 'auto', 
                    width: '500px', 
                    textAlign: 'center', 
                    border: 'solid 7px', 
                    margin: '200px', 
                    marginLeft: '450px', 
                    marginTop: '50px', 
                    padding: '20px', 
                    borderColor: '#FF171F'
                    }}>
                <p>
                The Marvel API Access Page is a dynamic platform designed for avid comic enthusiasts who want to 
                delve into the vast Marvel Comics universe. This web application provides users with a user-friendly
                interface to explore a paginated list of all Marvel comics, view detailed information about each comic, 
                and personalize their experience by creating sub-collections.

                So come dwell in this land of Super Heroes and Villans with us and re-live your childhood!
                </p>
            </div>
        </div>
        
    )
}

export default Home;