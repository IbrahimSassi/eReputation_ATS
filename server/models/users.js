/**
 * Created by MrFirases on 3/20/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema   = new Schema({
  username: String,
  firstName: String,
  lastName: String,


  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,


  businessName: String,
  employeesNumber: String,
  sector: String,
  accountType: String,
  creationDate:String
});


UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hashedPassword === hashedPassword;
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('User', UserSchema);
