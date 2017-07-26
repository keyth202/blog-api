// const uuid = require('uuid');

const mongoose = require('mongoose');

//blogpost schema

const blogSchema =  new mongoose.Schema({
  title: {type: String, required:true},
  author: {
            firstName: String,
            lastName: String
          },
   content: {type: String, required:true},
  publishDate: {type: String, default:Date}
});

// Name concatentation
 blogSchema.virtual('nameString').get(function(){
  //console.log('testing nameString', this.author);
  return `${this.author.firstName} ${this.author.lastName}`.trim();
}); 

blogSchema.methods.apiRepr = function(){
  return {
    id:this._id,
    title: this.title,
    author: this.nameString,
    content: this.content,
    publishDate: this.publishDate
  };
}





const Blogs = mongoose.model('Blogs', blogSchema)

module.exports = {Blogs};