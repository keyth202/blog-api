const express = require('express');
const router = express.Router();

const {Blogs} = require('./models');
const {PORT, DATABASE_URL} = require('./config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;



const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//Get responses

/* router.get('/', jsonParser, (req, res) => {
	var posts = BlogPosts.get();
	res.send(posts);
}) */

router.get('/', jsonParser, (req, res) => {
  Blogs.find().limit(10).exec()
    .then(blogs => {
      res.json({
        blogs: blogs.map(
          (blogs)=> Blogs.apiRepr())
      });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
});

router.get('/:id', jsonParser, (req, res) =>{
  Blogs
    .findById(req.params.id)
    .exec()
    .then(blogs => res.json(Blogs.apiRepr()))
    .catch(err => {
      console.error(err);
      res.statys(500).json({message: 'Internal server error'});
    });
});

//Post responses

/* router.post('/', jsonParser, (req, res) => {
  
  const requiredFields = ['title', 'content','author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content,req.body.author,req.body.publishDate);
  res.status(201).json(item);
}); */

router.post('/',  jsonParser, (req, res) =>{
  const requiredFields = ['title', 'content','author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blogs
    .create({
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      publishDate: req.body.publishDate
    });

  res.status(201).json(item);
});

// Delete blogs (by id)

/* router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
}); */

router.delete('/:id', (req, res) => {
  Blogs
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(blogs => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//put by id

/* router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content','author','id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating Blogs \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  // console.log(`---Blog post ---\`${Object.keys(updatedItem)}\``);
  res.status(200).send(updatedItem);
}) */

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content','author','id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }

  const toUpdate = {};

  requiredFields.forEach(field => {
    if(field in req.body){
    toUpdate[field] = req.body[field];
    }
  });

  Blogs
    .findByIdAndUpdate(req.params.id, {$set:toUpdate})
    .exec()
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



module.exports = {router};