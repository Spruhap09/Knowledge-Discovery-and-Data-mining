import React from 'react';
import disappointedMan from '../img/disappointedMan.jpeg';
import {useLocation} from 'react-router-dom';
//import ObjectList from './ObjectList';
function NotFound(props) {
    const { state } = useLocation();
    console.log(state)
    const backgroundStyle = {
        background: `url(${disappointedMan}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        // filter: 'blur(1px)'
        // Ensure the background covers the entire viewport height
    };
    return (
        <div style={backgroundStyle}>
            <div style ={{textAlign: 'center', marginTop: '0'}}>
                <p style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginTop: '0',
                    paddingTop: '20%',
                    filter: 'blur(0)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
                    Error: 404, {state.e.reason}</p>
            </div>
            
        </div>
    );
}

export default NotFound;