/**
 * Created by Ibrahim on 24/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Version 1 TODO To Improve

var options = {
  discriminatorKey: 'source'
};

var dataProviderSchema = new Schema({

  name: {
    type: String
    , index: true
  }
  , sourceLink: {
    type: String,
    index: true
  }
  , channelId: {
    type: String
  }
  , content: {
    type: String
  }
  , dateContent: {
    type: Date
  }
  , contentScore: {
    type: Object
  }
  , contentTopics: {
    type: Array
  }
  , contentEmotions: {
    type: Array
  }
  , contentLanguage: {
    type: String
  }
  , typeContent: {
    type: String
  }
  , author: {
    type: Object
  }
  , dateOfScraping: {
    type: Date,
    default: Date.now
  }
  , parentId: {
    type: String
  }

}, options);


var DataProvider = module.exports = mongoose.model('DataProvider', dataProviderSchema);

var facebookPostsProvider = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  }
  , reactions: {
    type: Array
  }
  , shares: {
    type: Number
  }

}, options);

module.exports.FacebookPostsProvider = DataProvider.discriminator('FacebookPostsProvider', facebookPostsProvider);

module.exports.createDataProviderModel = function (newDataProvider, callback) {
  newDataProvider.save(callback);
};

module.exports.getAllDataProvidersModel = function (callback) {
  DataProvider.find(callback);
};


