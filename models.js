// const uuid = require('uuid');

const mongoose = require('mongoose');

//blogpost schema

const blogSchema =  new mongoose.Schema({
  title: {type: String, required:true},
  author: {type: String, required:true},
   content: {type: String, required:true},
  publishDate: {type: String, default:Date}
});

// Name concatentation
/* blogSchema.virtual('nameString').get(function(){
  console.log('testing namestring', this.author);
  return `${this.author.firstName} ${this.author.lastName}`.trim();
}); */

blogSchema.methods.apiRepr = function(){
  return {
    id:this._id,
    title: this.title,
    author: this.author,
    content: this.content,
    publishDate: this.publishDate
  };
}



/*
const BlogPosts = {
  create: function(title, content, author, publishDate) {
    const post = {
      //id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex(
      post => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function(updatedPost) {
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};


function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

*/

const Blogs = mongoose.model('Blogs', blogSchema)

module.exports = {Blogs};