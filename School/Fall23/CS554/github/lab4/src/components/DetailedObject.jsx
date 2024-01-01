import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';
import noImage from '../img/noImage.jpg';
import metBackground from '../img/metBackground.jpeg';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';
const DetailedObject = () => {

    const [loading, setLoading] = useState(true);
    const [objectData, setObjectData] = useState(undefined);
    const [objectID, setObjectID] = useState(useParams().id);
    let navigate = useNavigate();
    
    useEffect(() => {
       
        async function fetchData (){
            
            try{
                const {data} = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
                // if (data.message && data.message === 'ObjectID not found'){
                //     console.log('failed')
                //     let error1 = { request: {status: 404}}
                //     error1.reason = 'There are no object IDs to be displayed'
                //     throw error1;
                // }
                setObjectData(data);
                setLoading(false);
            }
            catch(e){
                // console.log(e)
                
                
                let newObjectId = parseInt(objectID);
                if(newObjectId <= 0){
                    let e = { request: {status: 400}}
                    e.reason = 'The object ID cannot be less than or equal to zero'
                    navigate('/400', {state : {e}});
                }
                else if (e.request.status === 404){
                    let e = { request: {status: 404}}
                    e.reason = 'This object ID does not exist'
                    navigate('/404', {state : {e}});
                }
                else{
                    let e = { request: {status: 400}}
                    e.reason = 'You entered an invalid object id'
                    navigate('/400', {state : {e}});
                }
            }
        }
        fetchData();
    }, [objectID])

    const backgroundStyle = {
        background: `url(${metBackground}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        minHeight: '100vh', // Ensure the background covers the entire viewport height
    };

    if(loading){
        return(
            <div style={backgroundStyle}>
                <h1 style={{ 
                    fontFamily: 'Times New Roman', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    color: 'whitesmoke', 
                    paddingTop: '45vh', 
                    marginTop: '0'
                 }}>
                loading...</h1>
            </div>
        );
    }
    else{
        return (
            <div style={backgroundStyle}>
                <Card
                variant='outlined'
                sx={{
                    maxWidth: 400,
                    height: 'auto',
                    padding: '16px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 10,
                    border: '1px solid #E4002B'
                    // boxShadow:
                    // '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                }}
                >
                <CardActionArea>
                        <CardMedia
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}
                        component='img'
                        image={
                            objectData && objectData.primaryImage
                            ? objectData.primaryImage
                            : objectData && objectData.primaryImageSmall
                            ? objectData.primaryImageSmall
                            : noImage
                        }
                        title='object image'
                        />
                        <CardContent>
                            <Typography
                                sx={{
                                    borderBottom: '1px solid #E4002B',
                                    fontWeight: 'bold'
                                }}
                                gutterBottom
                                variant='h6'
                                component='h3'
                                > {objectData && objectData.title
                                    ? objectData.title
                                    : 'No title'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.artistDisplayName
                                    ? `Display Name: ${objectData.artistDisplayName}`
                                    : 'Display Name: No Display Name'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.artistDisplayBio
                                    ? `Display Bio: ${objectData.artistDisplayBio}`
                                    : 'Display Bio: No Display Bio'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.artistGender
                                    ? `Artist Gender: ${objectData.artistGender}`
                                    : 'Artist Gender: No Gender Available'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.objectDate
                                    ? `Object Date: ${objectData.objectDate}`
                                    : 'Object Date: No Object Date'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.department
                                    ? `Department: ${objectData.department}`
                                    : 'Department: No Department'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.medium
                                    ? `Medium: ${objectData.medium}`
                                    : 'Medium: No Medium'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.classification
                                    ? `Classification: ${objectData.classification}`
                                    : 'Classification: No Classification'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.culture
                                    ? `Culture: ${objectData.culture}`
                                    : 'Culture: No Culture'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.dimensions
                                    ? `Dimensions: ${objectData.dimensions}`
                                    : 'Dimensions: No Dimensions'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.creditLine
                                    ? `Credit Line: ${objectData.creditLine}`
                                    : 'Credit Line: No Credit Line'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.geographyType
                                    ? `Geography Type: ${objectData.geographyType}`
                                    : 'Geography Type: No Geography Type'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.city
                                    ? `City: ${objectData.city}`
                                    : 'City: No City'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.state
                                    ? `State: ${objectData.state}`
                                    : 'State: No State'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {objectData && objectData.country
                                    ? `Country: ${objectData.country}`
                                    : 'Country: No Country'}
                            </Typography>
                        </CardContent>
                </CardActionArea>
            </Card>
            </div>
        );
    }

}

export default DetailedObject;