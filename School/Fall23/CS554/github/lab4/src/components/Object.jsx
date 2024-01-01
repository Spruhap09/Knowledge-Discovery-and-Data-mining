import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import noImage from '../img/noImage.jpg';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';

const Object = ({objectID}) => {
    const [objectData, setObjectData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("In the useEffect for an Object")
        // console.log(objectID);
        async function fetchData() {
            try{
                const {data} = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
                setObjectData(data);
                setLoading(false);
            }
            catch(e){
                console.log(e);
            }
        }
        fetchData();
    }, [objectID])

    if(loading){
        return(
            <div>
                <p> </p>
            </div>
        );
    }
    else{
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={objectID} sx={{
                display: 'flex',
                justifyContent: 'center',  
                alignItems: 'center',    
              }}>
                <Card
                variant='outlined'
                sx={{
                    maxWidth: 250,
                    height: 'auto',
                    margin: '16px',
                    // marginLeft: 'auto',
                    // marginRight: 'auto',
                    borderRadius: 5,
                    border: '1px solid red',
                    boxShadow:
                    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                }}
                >
                <CardActionArea>
                    <Link to={`/collection/${objectID}`}>
                        <CardMedia
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}
                        component='img'
                        image={
                            objectData && objectData.primaryImageSmall
                            ? objectData.primaryImageSmall
                            : noImage
                        }
                        title='object image'
                        />
                        <CardContent>
                            <Typography
                            sx={{
                                borderBottom: '1px solid #1e8678',
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
                                ? objectData.artistDisplayName
                                : 'No Display Name'}
                            </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            {objectData && objectData.objectDate
                                ? objectData.objectDate
                                : 'No Object Date'}
                            </Typography>
                        </CardContent>
                    </Link>
                </CardActionArea>
            </Card>
        </Grid>
        );
    }
    
}
export default Object;