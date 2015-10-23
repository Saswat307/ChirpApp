/**
 * Created by SASWAT on 10/10/2015.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
//var users = {};
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        /*return done(null, user.username);*/

        done(null, user._id);
    });

    /*passport.deserializeUser(function(username, done) {

        return done(null, users[username]);

    });*/

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            /*if(!users[username]){
                console.log('User Not Found with username '+username);
                return done(null, false);
            }

            if(isValidPassword(users[username], password)){
                //sucessfully authenticated
                return done(null, users[username]);
            }
            else{
                console.log('Invalid password '+username);
                return done(null, false)
            }*/

            User.findOne({ 'username' :  username },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false);
                    }
                    // User exists but wrong password, log the error
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );
        }
    ));

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req,username, password,done) {
                console.log("inside signup   usename  "+username +" passord "+password );
                /*if (users[username]){
                    console.log('User already exists with username: ' + username);
                    return done(null, false);
                }

                //store user in memory
                users[username] = {
                    username: username,
                    password: createHash(password)
                }

                console.log(users[username].username + ' Registration successful');
                return done(null, users[username]);*/

                // find a user in mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false);
                    } else {
                        // if there is no user, create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.name=req.param('name');
                        newUser.email=req.param('email');
                        newUser.username = username;
                        newUser.password = createHash(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            console.log(newUser.username + ' Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};