const express = require('express');
const queryString = require('query-string');
const morgan = require('morgan');

const routes = require('./routes');


const {BlogPosts} = require('./models');

const app = express();


app.use(morgan('common'));

app.use('/blog-posts', routes);



app.get('*', (req, res) => res.send('ok'));

app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));