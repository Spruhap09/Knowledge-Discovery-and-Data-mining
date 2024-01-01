import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';

//TODO: YOU SHOULD NOT BE ABLE TO ACCESS THE SIGN UP PAGE OR THE LOG IN PAGE IF YOU ARE NOT LOGGED IN
//TODO: IF YOU ARE NOT LOGGED IN THEN YOU SHOULD NOT BE ABLE TO ACCESS THE LOGOUT Page
app.use;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false,
    cookie:  {maxAge: 300000}
}));

//One which will count the number of requests made to your website

let totalRequests = 0;

// app.use(async (req, res, next) => {
//     totalRequests++;
//     console.log(`There have been ${totalRequests} requests made to the server`);
//     next();
//   });

let pathObject = {}

app.use(async (req, res, next) => {
    const method = req.method;
    const route = req.originalUrl;

    const body = JSON.parse(JSON.stringify(req.body));
    
    if (route in pathObject){
        let count = pathObject[route] + 1;
        pathObject[route] = count;
    }
    else{
        pathObject[route] = 1;
    }
    if (body.password){
        delete body.password;
    }

    console.log(`You requested the url: ${route} ${pathObject[route]} times. The HTTP verb for the
    requested url is ${method}. The request body is: \n ${JSON.stringify(body)}`)
    next();
});

app.use('/logout', (req, res, next) => {
    if (!req.session.user){
        return res.status(401).json({error: "You need to log in to log out"});
    }
    next();
})
app.use('/login', (req, res, next) => {
    
    if (req.session.user && req.body.username === req.session.user.username){
        return res.status(400).json({error: "You are already logged in!"});
    }
    else if (req.session.user){
        return res.status(401).json({error: "Someone else is logged in!"});
    }
    next();
})

app.use('/signup', (req, res, next) => {
    
    if (req.session.user && req.body.username === req.session.user.username){
        return res.status(400).json({error: "You are already logged in!"});
    }
    else if (req.session.user){
        return res.status(401).json({error: "Someone else is logged in!"});
    }
    next();
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});