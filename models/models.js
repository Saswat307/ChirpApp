var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
    created_by: String ,		//should be changed to ObjectId, ref "User"  like { type: Schema.ObjectId, ref: 'User' }
    created_at: {type: Date, default: Date.now},
    text: String
});

var userSchema = new mongoose.Schema({
    name:String,
    email: String,
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
})


mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);


