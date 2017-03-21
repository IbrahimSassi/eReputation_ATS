/**
 * Created by Ibrahim on 21/03/2017.
 */
var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({

  name: {
    type: String
    , index: true
    , required: true
  }
  , url: {
    type: String
    , required: true

  }
  , type: {
    type: String,
    index: true,
    required: true
  }
  , dateCreation: {
    type: Date,
    default: Date.now
  }
  , personnel: {
    type: Boolean
  }
  , accessToken: {
    type: String
  }
});


var Channel = module.exports = mongoose.model('Channel', channelSchema);

//Get ALL Channels

module.exports.getChannels = function (callback) {
  Channel.find(callback);
};

//GetChannelBy ID

module.exports.getChannelById = function (id, callback) {
  Channel.findById(id, callback);

};

//Get Channel By Owner channels

// module.exports.getChannelByCategory = function (type, callback) {
//   var query = {type: type};
//
//   Channel.find(query, callback);
// }


//Add Channel

module.exports.createChannel = function (newChannel, callback) {
  newChannel.save(callback);

};


//updateCreation Channel

module.exports.updateChannel = function (id, data, callback) {
  var name = data.name;
  var url = data.url;
  var type = data.type;
  var personnel = data.personnel;
  var accessToken = data.accessToken;

  // var query = {_id: id};

  Channel.findById(id, function (err, channel) {
    if (!channel) {
      return next(new Error('Could not load channel'));
    }
    else {
      channel.name = name;
      channel.url = url;
      channel.type = type;
      channel.personnel = personnel;
      channel.accessToken = accessToken;
      channel.save(callback);

    }
  });

};


//Delete Channel

module.exports.removeChannel = function (id, callback) {

  Channel.find({_id: id}).remove(callback);

};




