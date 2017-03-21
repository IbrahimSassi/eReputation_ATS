/**
 * Created by MrFirases on 3/9/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
  text: String,
  screenName: String,
  createdAt: String,


});

module.exports = mongoose.model('Tweet', TweetSchema);
