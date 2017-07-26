const express = require('express');
const queryString = require('query-string');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');


//const {Blogs} = require('./models');
const {PORT, DATABASE_URL} = require('./config');


const app = express();

mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(morgan('common'));

app.use('/blog-posts', routes);



app.get('*', (req, res) => res.send('ok'));

/*
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));
*/



let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


