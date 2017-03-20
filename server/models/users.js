/**
 * Created by MrFirases on 3/20/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
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

module.exports = mongoose.model('Users', UsersSchema);
