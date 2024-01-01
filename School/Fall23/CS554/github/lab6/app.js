//TODO: check this is for the express server? Does it need to be in a seperate folder of its own?

import express from 'express';
const app = express();
import configRoutes from './src/routes/index.js';
import redis from 'redis';
import cors from 'cors';

const client = redis.createClient();
client.connect().then(() => {});

app.use;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use('/', (req, res, next) => {
  next();
})
configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

