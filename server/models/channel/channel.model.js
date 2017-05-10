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

module.exports = {
  getChannelsModel:getChannelsModel,
  getChannelByIdModel:getChannelByIdModel,
  getChannelByOwnerModel:getChannelByOwnerModel,
  createChannelModel:createChannelModel,
  updateChannelModel:updateChannelModel,
  removeChannelModel:removeChannelModel
};



//Get ALL Channels

function getChannelsModel (callback) {
  Channel.find(callback);
};

//GetChannelBy ID

function getChannelByIdModel(id, callback) {
  Channel.findById(id, callback);

};

// Get Channel By Owner

function getChannelByOwnerModel (userId, callback) {
  var query = {userId: userId};
  Channel.find(query, callback);
};

//Add Channel

function createChannelModel (newChannel, callback) {
  var channel = new Channel();

  channel.name = newChannel.name;
  channel.url = newChannel.url;
  channel.type = newChannel.type;
  channel.personal = newChannel.personal;
  channel.accessToken = newChannel.accessToken;
  channel.userId = newChannel.userId;
  channel.save(callback);

};


//updateCreation Channel

function updateChannelModel (id, data, callback) {
  var name = data.name;
  var url = data.url;
  var type = data.type;
  var personal = data.personal;
  var accessToken = data.accessToken;
  var userId = data.userId;

  // console.log("from model",id)
  // console.log("from model",data)
  // var query = {_id: id};

  Channel.findById(id, function (err, channel) {
    if (!channel) {
      //console.log("errorrr",err)
      return next(new Error('Could not load channel'));
    }
    else {
      // console.log("from model",channel)
      channel.name = name;
      channel.url = url;
      channel.type = type;
      channel.personal = personal;
      channel.accessToken = accessToken;
      channel.updatingDate = "heyy";
      channel.userId = userId;
      channel.save(callback);

    }
  });

};


//Delete Channel
function removeChannelModel (id, callback) {

  Channel.find({_id: id}).remove(callback);

};




