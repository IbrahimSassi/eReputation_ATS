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

  id: {
    type: String
  },
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
    type: Array
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

//Creating Index to use mongoDb Text Search
dataProviderSchema.index
({content: 'text', name: 'text'}, {name: 'Text index', weights: {content: 10, name: 5}});

// db.dataproviders.createIndex({ content: 'text', name: 'text' }, {name: 'Text index', weights: {content: 10, name: 5}})


var DataProvider = module.exports = mongoose.model('DataProvider', dataProviderSchema);

var facebookPostsProvider = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
  link: {
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


module.exports.getDataProvidersByConditionModel = function (query, callback) {
  DataProvider.find(query, callback);
};


module.exports.getDataProvidersByConditionSortedModel = function (query, options, sort, callback) {
  DataProvider
    .find(query, options)
    .sort(sort)
    .exec(callback);
};

module.exports.updateDataProviderModel = function (id, update, options, callback) {
  DataProvider.findByIdAndUpdate(id, update, options, callback)
};



