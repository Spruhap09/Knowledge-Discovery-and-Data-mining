import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import redis from 'redis';

const client = redis.createClient();
client.connect().then(() => {});

app.use;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', (req, res, next) => {
  next();
})
configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

