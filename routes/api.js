/**
 * Created by SASWAT on 10/10/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var User=mongoose.model('User');

//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET") {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};


//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.use('/profile',isAuthenticated);

router.route('/profile/posts/:username')

    //Return all posts of a user
    .get(function(req,res){

        console.log("param "+ req.params.username);
        Post.find({"created_by":req.params.username},function(err,posts){

            if(err)
            return res.send(500,err);

            return res.send(posts);

        })
    });

router.route('/profile/:username')
    // Return profile of a user
    .get(function(req,res){
        console.log("Param "+ req.params.username);
        User.findOne({"username":req.params.username},
            function(err,user){
                if(err)
                return res.send(500,err);

                return res.send(user);


            })
    });

router.route('/posts')

    //Return all post
    .get(function (req, res) {
        /*res.send({message:"TODO return all posts"});*/

        Post.find(function (err, posts) {
            if (err) {
                return res.send(500, err);

            }
            return res.send(posts);
        })
    })

    // Create new post
    .post(function (req, res) {
        /*res.send({message:"TODO create a new post"});*/

        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;

        post.save(function (err, post) {
            if (err) {

                return res.send(500, err);
            }

            return res.json(post);
        })
    });

router.route('posts/:id')

    //get a particular post
    .get(function (req, res) {
        /*res.send({message:"TODO get particular post " + req.param.id });*/

        Post.findById(req.param.id, function (err, post) {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    })

    //update a particular post
    .put(function (req, res) {
        /*res.send({message:"TODO update a particula post "+req.param.id });*/

        Post.findById(req.param.id, function (err, post) {
            if (err) {
                res.send(err);
            }

            post.created_by = req.body.created_by;
            post.text = req.body.text;


            post.save(function (err, post) {
                if (err) {
                    res.send(err);
                }

                res.json(post);
            });
        });


    })

    // delete a particular post
    .delete(function (req, res) {
        /*res.send({message:"TODO delete a particular post "+req.param.id});*/
        Post.remove({_id: req.param.id}, function (err) {

            if (err) {
                res.send(err);
            }

            res.json("deleted :(");
        });

    });


module.exports = router;
