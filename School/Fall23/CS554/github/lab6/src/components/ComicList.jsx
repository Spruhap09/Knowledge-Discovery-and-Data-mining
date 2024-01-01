import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import { Pagination, Grid, Stack } from '@mui/material';
import Comic from './Comic';

//TODO: FIX THE ERROR CODES IN THE BACKEND APPLICATION
const ComicList = () => {

    let {pagenum} =useParams()
    pagenum= parseInt(pagenum)
    //const [pagenum, setPageNum] = useState(parseInt(useParams().pagenum))
    const [comicData, setComicData] = useState(undefined);
    const [totalPages, setTotalPages] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    let navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true)
        async function fetchData(){
            try{
                let url = `http://localhost:3000/api/comics/page/${pagenum}`;
                const {data} = await axios.get(url);
                setComicData(data.data)
                console.log(data.data[0])
                setTotalPages(data.totalPages)
                setLoading(false)
            }
            catch(e){
                console.log(e)
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
        fetchData()
    }, [pagenum])

    const handlePageChange = (e, newPage) => {
        console.log('here')
        let currURL = location.pathname;
        let urlArr = currURL.split('/');
        urlArr[urlArr.length - 1] = newPage;
        let newURL = urlArr.join('/');
        console.log(`The new URL is ${newURL}`);
        pagenum = newPage;
        navigate(newURL);
    }

    if(loading){
        return (
            <div>
                <h2 style={{textAlign: 'center'}}>Loading...</h2>
            </div>
        )
    }
    else{
        return (
            <div style={{margin: '20px'}}>
                <Stack alignItems="center">
                    <Pagination 
                        count={totalPages}
                        page={pagenum}
                        onChange={handlePageChange}
                        hidePrevButton = {pagenum === 1}
                        hideNextButton = {pagenum === totalPages}
                        variant='outlined'
                        sx={{fontSize: 'bold'}}
                    />
                </Stack>
                
                <Grid container spacing={2}>
                    {comicData.map((comic) => <Comic key={comic.id} comicId = {comic.id}/>)}
                </Grid>

                <Stack alignItems="center">
                    <Pagination 
                        count={totalPages}
                        page={pagenum}
                        onChange={handlePageChange}
                        hidePrevButton = {pagenum === 1}
                        hideNextButton = {pagenum === totalPages}
                        variant='outlined'
                    />
                </Stack>
            </div>
        )
    }
}
export default ComicList;