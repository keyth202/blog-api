const express = require('express');
const queryString = require('query-string');
const morgan = require('morgan');

const routes = require('./routes');


const {BlogPosts} = require('./models');

const app = express();


app.use(morgan('common'));

app.use('/blog-posts', routes);



app.get('*', (req, res) => res.send('ok'));

/*
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));
*/

//functions for testing 
let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


