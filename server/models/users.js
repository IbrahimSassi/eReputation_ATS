/**
 * Created by MrFirases on 3/20/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var options = { discriminatorKey: 'kind' };

var UserSchema   = new Schema({



  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,



  creationDate:String,
  picture:String,
  address:String,
  state:String
},options);

var individualSchema = new Schema({
  username: String,
  firstName: String,
  lastName: String,

},options);

var businessSchema = new Schema({
  businessName: String,
  employeesNumber: String,
  businessType: String,
  businessID:String,

},options);

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
    firstName: this.firstName,
    lastName: this.lastName,
    businessName: this.businessName,
    employeesNumber: this.employeesNumber,
    businessType: this.businessType,
    accountType: this.accountType,
    creationDate:this.creationDate,
    businessID:this.businessID,
    picture:this.picture,
    address:this.address,
    state:this.state,
    kind: this.kind,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.Individual= User.discriminator('Individual',individualSchema);
module.exports.Business= User.discriminator('Business',businessSchema);
