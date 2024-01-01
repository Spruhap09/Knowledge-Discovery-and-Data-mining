# CS-554 Final Project

## Prerequisites
To run this web application you must have [node.js (including npm)](https://nodejs.org/en/download/current) and [firebase cli](https://firebase.google.com/docs/cli) installed on your machine.

## To run
Create a config file in the firebase directory (@/firebase/config.ts).

In addition, place the config file in the following directory (dist/src/firebase/config.mjs). Make sure to change the extension in this directory so that the server.mjs file will be able to read it.

Place your Firebase configuration settings in there which you can get from Firebase Console.
You may also have to execute ```firebase login``` in your shell.

Then install node modules and run all servers
```
npm i
npm start
```

## Note
Running npm start will simultaneously start the next.js app as well as the firebase emulators.
The emulators will be automatically seeded with data stored in a top-level directory called 'emulator-data'.
On exit the firestore emulator will save changes you have made to that same directory so they persist next time you run the app. If you don't want this behavior you can run ```npm run start-no-save```.
Also all seeded accounts have the password 'password' if you'd like to access them.


## Reference Documentation
HTML Canvas:
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

Colorwheel:
https://casesandberg.github.io/react-color/

Material Tailwind:
https://www.material-tailwind.com/

Firestore:
https://firebase.google.com/docs/firestore/quickstart

Socket.io:
https://socket.io/docs/v4/