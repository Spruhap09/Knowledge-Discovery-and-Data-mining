import express from 'express';
const router = express.Router();
import redis from 'redis';
const client = redis.createClient();
import axios from 'axios';
import md5 from 'blueimp-md5';
const publickey = 'cbd805d9ae6fa8af26e83c4cfe4c3292';
const privatekey = '0a421ac0a4db7c6d44f38bc81b5c2322d9e0209c';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const pageLimit = 50;
client.connect().then(() => {});

const getTotal = async() => {
    try{
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
        const url =  baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash
        let {data} = await axios.get(url);
        return data.data.total;
    }
    catch(e){
        return -1;
    }
}

router.get('/api/comics/page/:pagenum', async(req, res) => {
    try{

        if (!req.params.pagenum){
            return res.status(400).json({error: "Please supply a page number!"});
        }

        const pagenum = req.params.pagenum.trim();
        if (pagenum.length === 0){
            return res.status(400).json({error: "Page number cannot be just empty spaces!"});
        }

        if (!((/^[0-9]+$/).test(pagenum))){
            return res.status(400).json({error: "Page number can only have numbers!"});
        }
        
        if(pagenum <= 0){
            console.log('sup')
            return res.status(400).json({error: "Page number can only be positive whole number!"});
        }
        
        const total = await getTotal();
        if (total === -1){
            return res.status(500).json({error: "wwwThe call to API failed, please try again!"});
        }

        const totalPages = Math.ceil(total/pageLimit);
        
        //TODO: CHECK IF THE PAGE NUMBER IS INT ONLY!
        //TODO: IF THE PAGE NUMBER IS MORE THAN THE TOTAL, ERROR OUT

        if(pagenum > totalPages){
            return res.status(404).json({error: "We couldn't find any comic details for that page number!"});
        }
        
        let exists = await client.exists(`Page${pagenum}`);
        if(exists){
            let pageData = await client.get(`Page${pagenum}`);
            console.log(pageData)
            console.log("Sending the page from the cache")
            return res.json(JSON.parse(pageData));
        }
        const offset = (pagenum - 1) * pageLimit;

        console.log(`The offset is: ${offset}`)
        console.log(`the current page number is: ${pagenum}`)
        //TODO: CHECK WHY THE PAGE NUMBER IS NOT WORKING FOR 1164 AND 1165
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
        const url =  baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&offset=' +offset+ '&limit=' + pageLimit;
        
        let {data} = await axios.get(url);
        console.log(data)
        if (data.data.count === 0){
            return res.status(404).json({error: "We couldn't find any comic details for that page number!"})
        }
        let answer = {data: data.data.results, totalPages: totalPages}
        console.log('Adding the page details TO THE cache')
        await client.set(`Page${pagenum}`, JSON.stringify(answer))
        res.json(answer)
    }
    catch(e){
        // res.status(404).json({error: "We couldn't find any comic details for that page number!"});
        res.status(500).json({error: "The call to API failed, please try again!"});
    }
})


router.get('/api/comics/:id', async(req, res) => {
    try{
        if (!req.params.id){
            return res.status(400).json({error: "Please supply an id!"});
        }
        const id = req.params.id.trim();
        if (id.length === 0){
            return res.status(400).json({error: "Id cannot be just empty spaces!"});
        }
        if (id <= 0){
            return res.status(400).json({error: "Id can only be a positive whole number!"});
        }

        if (!((/^[0-9]+$/).test(id))){
            return res.status(400).json({error: "Id can only have numbers!"});
        }
        
        let exists = await client.exists(`Comic${req.params.id}`);
        if (exists){
            let charac = await client.get(`Comic${req.params.id}`);
            console.log("Sending the comic details from the cache");
            //TODO: check the return id when you send the json back
            return res.json(JSON.parse(charac));
        }
        console.log('Comic not in cache');
        const baseUrl = `https://gateway.marvel.com:443/v1/public/comics/${req.params.id}`;
        const url =  baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        let {data} = await axios.get(url);
        //TODO: IS THIS STATUS OK?
        const result = data.data.results[0];
        await client.set(`Comic${req.params.id}`, JSON.stringify(result));
        res.json(result);
    }
    catch(e){
        res.status(404).json({error: "We couldn't find that comic_issue"});
    }
})
export default router;