import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import {useDispatch,  useSelector} from 'react-redux';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button
} from '@mui/material';
import noImage from '../img/noImage.png'
import * as actions from '../actions';

const Comic = ({comicId}) => {
    const [comicData, setComicData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const allCollections = useSelector((state) => state.collections)
    const selectedCollection = useSelector((state) => state.selection)[0];

    const currentCollection = allCollections.find((collection) => collection.collectionName === selectedCollection.collectionName)
    console.log('this is the current collection')
    console.log(currentCollection)
    useEffect(() => {
        async function fetchData() {
            try{
                const {data} = await axios.get(`http://localhost:3000/api/comics/${comicId}`)
                setComicData(data)
                setLoading(false)
            }
            catch(e){
                if (e.response.status === 400){
                    navigate('/400')
                }
                if (e.response.status === 404){
                    navigate('/404')
                }
                if (e.response.status === 500){
                    navigate('/500')
                }
            }
        }
        fetchData();
    }, [comicId])

    const handleAddToCollection = () => {
        dispatch(actions.addComicFromCollection(currentCollection.collectionName, comicData))
    }
    
    const handleRemoveFromCollection = () => {
        dispatch(actions.removeComicFromCollection(currentCollection.collectionName, comicData))
    }

    if(loading){
        return (
            <div>
                <p></p>
            </div>
        );
    }
    else{
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={comicId} sx={{
                display: 'flex',
                justifyContent: 'center',  
                alignItems: 'center', 
              }}>
                <Card
                variant='outlined'
                sx={{
                    maxWidth: 250,
                    height: 400,
                    margin: '16px',
                    // marginLeft: 'auto',
                    // marginRight: 'auto',
                    borderRadius: 5,
                    border: '1px solid red',
                    boxShadow:
                    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
                    overflow: 'auto'
                }}
                >
                <CardActionArea>
                    <Link to={`/marvel-comics/${comicId}`}>
                    <CardMedia
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}
                        component='img'
                        image={
                            comicData && (comicData.images.length > 0)
                            ? `${comicData.images[0].path}/portrait_incredible.${comicData.images[0].extension}`
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
                                > {comicData && comicData.title
                                    ? comicData.title
                                    : 'No title'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {comicData && comicData.description
                                    ? `Description: ${comicData.description}`
                                    : 'Description: No Description'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {comicData && (comicData.dates.find(date => date.type === "onsaleDate"))
                                    ? `On Sale Date: ${new Date(comicData.dates.find(date => date.type === "onsaleDate").date)}`
                                    : 'On Sale Date: No Date available'}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {comicData && (comicData.prices.find(price => price.type === "printPrice"))
                                    ? `Print Price: ${comicData.prices.find(price => price.type === "printPrice").price}`
                                    : 'Print Price: No Price available'}
                            </Typography>
                        </CardContent>
                    </Link>
                </CardActionArea>
                <div>
                    {(currentCollection.collection.find((comic) => comic.id === comicData.id) !== undefined)?
                    (<Button onClick={handleRemoveFromCollection}>Give Up Comic</Button>) 
                    : (
                        currentCollection.collection.length < 20 && (
                            <Button onClick={handleAddToCollection}>Collect Comic</Button>
                        ) 
                    )}
                </div>
                </Card>
              </Grid>
        )
    }
}
export default Comic;
