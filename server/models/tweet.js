/**
 * Created by MrFirases on 3/9/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
  text: String,
  lastName: String,
  username: String,
  city: String,
  email: String,
  phoneNumber: String,
  profilePicture: String,
  creationDate: { type: Date, default: Date.now },
  badge: String

});

module.exports = mongoose.model('Tweet', TweetSchema);
