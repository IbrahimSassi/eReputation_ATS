/**
 * Created by MrFirases on 3/23/2017.
 */
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
  GENERATED_VERIFYING_URL: String,

  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,


  businessName: String,
  employeesNumber: String,
  businessType: String,
  accountType: String,
  creationDate:String,
  businessID:String,
  picture:String,
  address:String,
  state:String
});


UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};


module.exports = mongoose.model('tempUser', UserSchema);
