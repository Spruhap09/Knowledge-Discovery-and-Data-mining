import express, { json } from 'express';
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

//TODO: why does just adding letters at the end not cause a change? 
//should we ensure that the id can only contain numbers?

client.connect().then(() => {});

router.get('/api/characters/history', async(req, res) => {
    try{
        const length = await client.lLen('history'); 
        console.log("the length is")
        console.log(length)
        if (length === 0){
            return res.json([]);
        }
        const listValue = await client.lRange('history', 0, 19);
        let list = [];
        for (let val of listValue){
            const exist = await client.exists(`Character${val}`);
            if(exist){
                let value = await client.get(`Character${val}`);
                list.push(JSON.parse(value));
            }
            else{
                throw `${val} is not cached`
            }
        }
        res.json(list);
    }
    catch(e){
        //TODO: IS THIS THE RIGHT RETURN CODE?
        res.status(404).json({error: e});
    }
})

router.get('/api/characters/:id', async(req, res) => {
    //the checking if the character has a cache entry would be done the app.js
    try{
        if (!req.params.id){
            return res.status(400).json({error: "Please supply an id!"});
        }
        const id = req.params.id.trim();
        if (id.length === 0){
            return res.status(400).json({error: "Id cannot be just empty spaces!"});
        }
        let exists = await client.exists(`Character${req.params.id}`);
        if (exists){
            let charac = await client.get(`Character${req.params.id}`);
            console.log("Sending the character details from the cache");
            await client.lPush('history', req.params.id);
            //TODO: check the return id when you send the json back
            return res.json(JSON.parse(charac));
        }
        //TODO: CHECK IF THE ID CAN ONLY HAVE NUMBERS
        console.log('Character not in cache');
        const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${req.params.id}`;
        const url =  baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        let {data} = await axios.get(url);
        //TODO: IS THIS STATUS OK?
        const result = data.data.results[0];
        await client.set(`Character${req.params.id}`, JSON.stringify(result));
        await client.lPush('history', req.params.id);
        res.json(result);
    }
    catch(e){
        res.status(404).json({error: "We couldn't find that character"});
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

router.get('/api/stories/:id', async(req, res) => {
    try{
        if (!req.params.id){
            return res.status(400).json({error: "Please supply an id!"});
        }
        const id = req.params.id.trim();
        if (id.length === 0){
            return res.status(400).json({error: "Id cannot be just empty spaces!"});
        }
        let exists = await client.exists(`Story${req.params.id}`);
        if (exists){
            let charac = await client.get(`Story${req.params.id}`);
            console.log("Sending the story details from the cache");
            //TODO: check the return id when you send the json back
            return res.json(JSON.parse(charac));
        }
        console.log('Comic not in cache');
        const baseUrl = `https://gateway.marvel.com:443/v1/public/stories/${req.params.id}`;
        const url =  baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        let {data} = await axios.get(url);
        //TODO: IS THIS STATUS OK?
        const result = data.data.results[0];
        await client.set(`Story${req.params.id}`, JSON.stringify(result));
        res.json(result);
    }
    catch(e){
        res.status(404).json({error: "We couldn't find that comic_story"});
    }
})



export default router;