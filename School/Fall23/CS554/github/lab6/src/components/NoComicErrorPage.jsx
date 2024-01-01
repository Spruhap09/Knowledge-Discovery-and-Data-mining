import React from 'react';
import error from '../img/error.png';
import {useLocation} from 'react-router-dom';


const NoComicErrorPage = () => {
    

    const backgroundStyle = {
        background: `url(${error}) no-repeat center center fixed`,
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
                    Error: 404</p>
            </div>
            
        </div>
    );
}

export default NoComicErrorPage;