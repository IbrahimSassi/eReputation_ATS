/**
 * Created by MrFirases on 3/20/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var options = {discriminatorKey: 'kind'};

var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,
  state: String,

  creationDate: String,
  phoneNumber: String,
  profilePicture: {type:String,default:"default/avatar"},
  coverPicture: {type:String,default:"default/user-profile-bg"},
  about: {type: String,minlength: 6},
  birthday: String,
  country: String

}, options);


var individualSchema = new Schema({
  username:  {
  type: String,

    required: true,
    minlength: 3
},
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
}, options);

var businessSchema = new Schema({
  businessName: {
    type: String,
    required: true,
    minlength: 3
  },
  employeesNumber: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },



}, options);

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};


UserSchema.methods.validPassword = function (password) {
  var hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hashedPassword === hashedPassword;
};

UserSchema.methods.generateJwt = function () {
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
    creationDate: this.creationDate,
    picture: this.picture,
    address: this.address,
    state: this.state,
    kind: this.kind,
    phoneNumber: this.phoneNumber,
    profilePicture: this.profilePicture,
    coverPicture: this.coverPicture,
    about: this.about,
    birthday: this.birthday,
    country: this.country,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.Individual = User.discriminator('Individual', individualSchema);
module.exports.Business = User.discriminator('Business', businessSchema);
