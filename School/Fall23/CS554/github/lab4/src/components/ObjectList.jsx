import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Object from './Object'
import {useParams, useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import { Pagination, Grid, Stack } from '@mui/material';
import SearchObject from './SearchObject';
import metBackground from '../img/metBackground.jpeg';


//TODO: DO THE ERROR HANDELING!
const ObjectList = () => {
    let {page} =useParams()
    page= parseInt(page)
    // console.log('This is the page')
    // console.log(useParams().page)
    // console.log(useParams())
    
    // let [page, setPage] = useState(parseInt(useParams().page));
    const [loading, setLoading] = useState(true);
    const [objectsData, setObjectsData] = useState([]);
    const [totalPages, setTotalPages] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageData, setPageData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const departmentId = searchParams.get("departmentIds")
    const location = useLocation();

    let navigate = useNavigate();

    useEffect(() => {
        
        // console.log('on load useeffect');
        async function fetchData() {
            try{
                let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
                if (departmentId){

                    let error = { request: {status: 400}}
                    if (!((/^[0-9]+$/).test(departmentId))){
                        error.reason = 'The department Id must only contain numbers'
                        throw error;
                    }
                    let intDepartment = parseInt(departmentId);
                    if (intDepartment <= 0){
                        error.reason = 'The department Id must be greater than zero'
                        throw error;
                    }
                    url = url + `?departmentIds=${departmentId}`
                }

                const {data} = await axios.get(url);
                // console.log('Printing out the data');
                let { total, objectIDs } = data;
                // console.log(objectIDs)
                if (total === 0){
                    let error1 = { request: {status: 404}}
                    error1.reason = 'There are no object IDs to be displayed for this department id'
                    throw error1;                   
                }
                const totalPage = Math.ceil(total / 50);
                objectIDs = objectIDs.sort();
                setObjectsData(objectIDs);
                setTotalPages(totalPage)
                setLoading(false);
            }
            catch(e){
    
                if (e.request.status === 404){
                    navigate('/404', {state: {e}});
                }
                else{
                    //console.log(e)
                    navigate('/400', {state: {e}})
                }
            }
        }
        fetchData();
        //TODO: DO WE need to have loading here?
    }, [departmentId]);

    useEffect(() => {
        console.log('Search term use effect')
        async function fetchData() {
            try{
                let url = new URL('https://collectionapi.metmuseum.org/public/collection/v1/search');

                if (departmentId){
                    let error = { request: {status: 400}}
                    if (!((/^[0-9]+$/).test(departmentId))){
                        error.reason = 'The department Id must only contain numbers';
                        throw error;
                    }
                    let intDepartment = parseInt(departmentId);
                    if (intDepartment <= 0){
                        error.reason = 'The department Id must be greater than zero';
                        throw error;
                    }
                    url.searchParams.set('departmentId', departmentId);
                }
                url.searchParams.set('q', searchTerm);
                const {data} = await axios.get(url);
                let { total, objectIDs } = data;
                if (total === 0){
                    let error1 = { request: {status: 404}}
                    error1.reason = 'There are no object IDs to be displayed'
                    throw error1;
                }
                objectIDs.sort();
                const totalPage = Math.ceil(total / 50);
                setSearchData(objectIDs);
                console.log(searchData)
                setTotalPages(totalPage)
                setLoading(false);
            }
            catch(e){
                if (e.request.status === 404){
                    navigate('/404', {state: {e}});
                }
                else{
                    navigate('/400', {state: {e}})
                }
            }
        }
        if (searchTerm) {
            fetchData();
        }
    }, [searchTerm]);

    useEffect(() => {
        function fetchPageData() {
            try{
                let error1 = { request: {status: 400}}
                let error2 = { request: {status: 404}}
                if (!(!isNaN(page) && Number.isInteger(page))){
                    error1.reason = 'The page number is not valid number'
                    throw error1;
                }
                if (page > totalPages){
                    error2.reason = `There are not enough objects for this search to be displayed on page ${page}`
                    throw error2;
                }
                if (page <= 0){
                    error1.reason = 'The page number cannot be less than zero'
                    throw error1;
                }
                if(searchTerm){
                    if (!searchData){
                        error2.reason = 'There are no objects for this search'
                        throw error2;
                    }
                    else if (searchData.length < 20){
                        setPageData(searchData)
                    }
                    else{
                        const start = (page - 1)*20;
                        const end = start + 20;                     
                        setPageData(searchData.slice(start, end));
                    }
                        
                }
                else{
                    const start = (page - 1)*50;
                    const end = start + 50;
                    setPageData(objectsData.slice(start, end));
                }
            }
            catch(e){
                //console.log(e)
                if (e.request.status === 404){
                    navigate('/404', {state: {e}});
                }
                else{
                    //console.log(e)
                    navigate('/400', {state: {e}})
                }
            }
        }
        fetchPageData();

    }, [page, objectsData, searchTerm, searchData])

    

    const searchValue = async (value) => {
        setSearchTerm(value);
    };

    const handlePageChange = (e, newPage) =>{

        // setPage(parseInt(newPage));
        let currURL = location.pathname;
        let urlArr = currURL.split('/');
        urlArr[urlArr.length - 1] = newPage;
        let newURL = urlArr.join('/');
        if (departmentId){
            //TODO: DO I NEED THIS CHECK HERE?
            let intDepartment = parseInt(departmentId);
            if (intDepartment <= 0){
                let error1 = { request: {status: 400}}
                error1.reason = 'Department ID cannot be non negative'
                navigate('/400', {state: {error1}});
            }
            newURL = newURL + `?departmentIds=${departmentId}`
        }
        console.log(`The new URL is ${newURL}`);
        page = newPage;
        navigate(newURL);
    }

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
                    I am loading...</h1>
            </div>
        );
    }
    else{
        return(
            <div style={backgroundStyle}>
                <h2 style={{ 
                    fontFamily: 'Times New Roman', 
                    fontWeight: 'bolder', 
                    textAlign: 'center', 
                    paddingTop: '5vh', 
                    marginTop: '0'
                }}>
                    Page: {page}
                </h2>
                <SearchObject searchValue={searchValue} />
                <Stack alignItems="center">
                    <Pagination 
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        hidePrevButton = {page === 1}
                        hideNextButton = {page === totalPages}
                        variant='outlined'
                        sx={{fontSize: 'bold'}}
                    />
                </Stack>
                
                <Grid container spacing={2}>
                    {pageData.map((objectID) => <Object key={objectID} objectID = {objectID}/>)}
                </Grid>

                <Stack alignItems="center">
                    <Pagination 
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        hidePrevButton = {page === 1}
                        hideNextButton = {page === totalPages}
                        variant='outlined'
                    />
                </Stack>
            </div>
        );
    }
}

export default ObjectList;