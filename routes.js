const express = require('express');
const router = express.Router();

const {BlogPosts} = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const app = express();

BlogPosts.create("First Title","Stuff for content","Author Mandebubble","01/01/01");

router.get('/', jsonParser, (req, res) => {
	var posts = BlogPosts.get();
	res.send(posts);
})

router.post('/', jsonParser, (req, res) => {
  
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
});

// Delete recipes (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

//putt bi id
router.put('/:id', jsonParser, (req, res) => {
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
    date: req.body.publishDate
  });
  res.status(204).json(updatedItem);
})

module.exports = router;