var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var User;

// db.once('open', function() {

  var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    createdAt: {type: Date, default: Date.now}
  });

  userSchema.methods.hashPassword = function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this);
  };

  userSchema.methods.comparePassword = function(attPassword, callback){
    bcrypt.compare(attPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  };

  userSchema.pre('save', function(next){
    this.hashPassword()
        .then(function(hash) {
          this.password = hash;
          next();
      });
  });

  User = mongoose.model('User', userSchema, 'Users');

// });

module.exports = User;
