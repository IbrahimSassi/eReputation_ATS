/**
 * Created by MrFirases on 3/9/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
  text: String,
  screenName: String,
  createdAt: String,
  positive: [String],
  nagative: [String],
  score: String,
  profilePicture: String,
  creationDate: { type: Date, default: Date.now },
  badge: String

});

module.exports = mongoose.model('Tweet', TweetSchema);
