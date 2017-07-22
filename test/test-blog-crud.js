const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Testing Blog API', function(){
	//start and close functions
	before(function() {
    	return runServer();
  	});
  	after(function() {
    	return closeServer();
    });
	//get test
  	it('Should test GET response', function(){
  		return chai.request(app)
  			.get('/blog-posts')
  			.then(function(res){
  				res.should.have.status(200);
  				res.should.be.json;
  				res.body.should.be.a('array');
  				//res.body.length.should.be.at.least(1);

  				const expectedKeys = ['title', 'content','author','publishDate','id'];
  				res.body.forEach(function(item){
  					item.should.be.a('object');
  					item.should.include.keys(expectedKeys);
  				});
  			});

  	});
	// POST test
  	it('Should add item with POST', function(){
  		const newItem = {title:'test blog post',
  						content:'so many words are here',
  						author: 'Probably Batman',

            };
  		return chai.request(app)
  			.post('/blog-posts')
  			.send(newItem)
  			.then(function(res){
  				res.should.have.status(201);
  				res.should.be.json;
  				res.body.should.be.a('object');
  				res.body.should.include.keys('title', 'content','author','publishDate','id');
  				res.body.id.should.not.be.null;
         

  				//res.body.should.deep.equal(Object.assign(newItem, {id:res.body.id}));
  			});

  	});
  	//PUT test
 	it('should update items on PUT', function() {
 		var post;
	    return chai.request(app)
	      
	      .get('/blog-posts')
	      .then(function(res) {
	       	post = res.body[0];
	        post.content = 'changed content';
          console.log(res.body[0]);
          console.log(post.id);
	        return chai.request(app)
	          .put(`/blog-posts/${post.id}`)
	          .send(post);
	      })
	      .then(function(res) {
	        res.should.have.status(200);
	        res.should.be.json;
	        res.body.should.be.a('object');
	        res.body.should.deep.equal(post);
	      });
 	 }); 
  //DELETE test	
  it('should delete items on DELETE', function() {
	    return chai.request(app)

	      .get('/blog-posts')
	      .then(function(res) {
	        return chai.request(app)
	          .delete(`/blog-posts/${res.body[0].id}`);
	      })
	      .then(function(res) {
	        res.should.have.status(204);
	      });
	  }); 

});

