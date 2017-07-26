const express = require('express');
const router = express.Router();

const {Blogs} = require('./models');
const {PORT, DATABASE_URL} = require('./config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;



const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//Get responses


router.get('/', (req, res) => {
  Blogs.find().exec()
    .then(blogs => {
      res.json( blogs.map(blog => blog.apiRepr()));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) =>{
  Blogs
    .findById(req.params.id)
    .exec()
    .then(blogs => {
      res.json(blogs.map(blog => blog.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.statys(500).json({message: 'Internal server error'});
    });
});

//Post responses


router.post('/', (req, res) =>{
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
      author: {
        firstName: req.body.author.firstName,
        lastName: req.body.author.lastName
      }, 
      content: req.body.content,
    })
  .then(blog => res.status(201).json(blog.apiRepr()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error:'Internal Server Error'});
  });

});

// Delete blogs (by id)



router.delete('/:id', (req, res) => {
  Blogs
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(blogs => res.status(204).json({message:'Post deleted'}))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//put by id



router.put('/:id', (req, res) => {
  const requiredFields = ['title', 'content','author'];

  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({error:'Ids do not match'});
  }

  const toUpdate = {};

  requiredFields.forEach(field => {
    if(field in req.body){
    toUpdate[field] = req.body[field];
    }
  });

  Blogs
    .findByIdAndUpdate(req.params.id, {$set:toUpdate}, {new:true})
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



module.exports = router;