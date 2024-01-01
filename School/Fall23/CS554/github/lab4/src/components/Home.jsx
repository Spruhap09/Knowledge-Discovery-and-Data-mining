import React from 'react';
import { Route, Link, Routes} from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';
import metBackground from '../img/metBackground.jpeg';
//import ObjectList from './ObjectList';
function Home(props) {

    const backgroundStyle = {
        background: `url(${metBackground}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        minHeight: '100vh', // Ensure the background covers the entire viewport height
    };

    return (
        <div style={backgroundStyle}>
            <br/>
            <h1 style={{fontFamily: 'Times New Roman', textAlign: 'center', color: 'whitesmoke', marginTop: '0'}}>
                Who Are We?
            </h1>
            <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{color: 'white', fontWeight: 'bold',textAlign: 'center', fontSize: 25}}>
                Welcome to our art appreciation hub! Our site is your gateway to the mesmerizing
                world of The Metropolitan Museum of Art. We've harnessed the power of the MET API
                to bring you an extensive list of artworks that span the ages and genres. 
                Explore the rich tapestry of human creativity, from classical masterpieces to 
                contemporary marvels.
            </p>
            <br/>
            <p style={{color: 'white', fontWeight: 'bold',textAlign: 'center', fontSize: 25}}>
                With our user-friendly website, you can now browse through all your favourite art
                pieces from your home, and learn more about any of them by clicking them. Thats not all -
                you can now also filter the art pieces based on your favourite departments here at The MET,
                and search your favourite artist up as well! Whether you're a seasoned art enthusiast 
                or a curious newcomer, our site invites you to immerse yourself in the beauty and history
                of The Met's collection. Join us on this artistic journey, and let your imagination roam free!
            </p>
            </div>
            <div style={{ textAlign: 'center'}}>
            <Link className='objectLink' to='/collection/page/1'
            style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '50px',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                Click here to see all the objects!
            </Link>
            </div>
            
        </div>
    );
}

export default Home;