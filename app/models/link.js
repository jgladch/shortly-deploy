var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Link;

// db.once('open', function() {

  var linkSchema = mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number,
    //userId: mongoose.Schema.Types.ObjectId,
    createdAt: {type: Date, default: Date.now}
  });

  linkSchema.pre('save', function(next){
    if (!this.code){
      var shasum = crypto.createHash('sha1');
      shasum.update(this.url);
      //shasum.update(doc.userId);
      this.code = shasum.digest('hex').slice(0, 5);
    }
    next();
  });

  Link = mongoose.model('Link', linkSchema, 'Links');

// });

module.exports = Link;
