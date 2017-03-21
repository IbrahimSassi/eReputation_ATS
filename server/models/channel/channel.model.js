/**
 * Created by Ibrahim on 21/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({

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
  , personal: {
    type: Boolean
  }
  , accessToken: {
    type: String
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


var Channel = module.exports = mongoose.model('Channel', channelSchema);

//Get ALL Channels

module.exports.getChannelsModel = function (callback) {
  Channel.find(callback);
};

//GetChannelBy ID

module.exports.getChannelByIdModel = function (id, callback) {
  Channel.findById(id, callback);

};

// Get Channel By Owner

module.exports.getChannelByOwnerModel = function (userId, callback) {
  var query = {userId: userId};
  Channel.find(query, callback);
};


//Add Channel

module.exports.createChannelModel = function (newChannel, callback) {
  var channel = new Channel();

  channel.name = newChannel.name;
  channel.url = newChannel.url;
  channel.type = newChannel.type;
  channel.personal = newChannel.personal;
  channel.accessToken = newChannel.accessToken;
  channel.save(callback);

};


//updateCreation Channel

module.exports.updateChannelModel = function (id, data, callback) {
  var name = data.name;
  var url = data.url;
  var type = data.type;
  var personal = data.personal;
  var accessToken = data.accessToken;

  // var query = {_id: id};

  Channel.findByIdModel(id, function (err, channel) {
    if (!channel) {
      return next(new Error('Could not load channel'));
    }
    else {
      channel.name = name;
      channel.url = url;
      channel.type = type;
      channel.personal = personal;
      channel.accessToken = accessToken;
      channel.updatingDate = "heyy";
      channel.save(callback);

    }
  });

};


//Delete Channel
module.exports.removeChannelModel = function (id, callback) {

  Channel.find({_id: id}).remove(callback);

};




