/**
 * Created by Ibrahim on 24/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require("underscore");
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
    type: String
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
  },
  campaignId: {
    type: String,
    // ref: 'campaigns'
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
  },
  story: {
    type: String
  }
  , reactions: {
    type: Array
  }
  , shares: {
    type: Number
  }

}, options);

var facebookCommentsProvider = new Schema({
  parentId: {
    type: String
  }

}, options);

module.exports.FacebookPostsProvider = DataProvider.discriminator('FacebookPostsProvider', facebookPostsProvider);
module.exports.FacebookCommentsProvider = DataProvider.discriminator('FacebookCommentsProvider', facebookCommentsProvider);

//****** Twitter Provider

var tweetsProvider = new Schema({
  hashtags: {
    type: Array
  },
  tweetType: {
    type: String
  },
  resultType: {
    type: String
  },
  place: {
    type: String
  },
  counts: {
    type: Object
  }

}, options);

module.exports.tweetsProvider = DataProvider.discriminator('tweetsProvider', tweetsProvider);

//****** End Twitter Provider

/**
 *  Websites Provider
 */

var websitesProvider = new Schema({
  numberOfViews: {
    type: Number
  }
}, options);

module.exports.websitesProvider = DataProvider.discriminator('websitesProvider', websitesProvider);

/**
 * END Websites Provider
 */

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


module.exports.avgPositivitybyCompaign = function (id) {
  console.log(id)
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 3)),
              '$lt': new Date()
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {
        $group: {_id: "$channelId", positive_score: {$avg: "$contentScore.positivity"}}
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

module.exports.avgNegativitybyCompaign = function (id) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 3)),
              '$lt': new Date()
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {$group: {_id: "$channelId", negative_score: {$avg: "$contentScore.negativity"}}}], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};
module.exports.avgNeutralitybyCompaign = function (id) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 3)),
              '$lt': new Date()
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {$group: {_id: "$channelId", neutral_score: {$avg: "$contentScore.neutral"}}}], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};


module.exports.findNulledScore = function (score) {
  return new Promise(function (resolve, reject) {
    DataProvider.findOne({contentScore: null}, function (err, data) {
      if (err) reject(err);
      resolve(data);
    })

  });
}


module.exports.updateScore = function (dataProviderToUpdate, score) {
  return new Promise(function (resolve, reject) {
    DataProvider.update({_id: dataProviderToUpdate._id}, {$set: {contentScore: score}}, function (err, updatedData) {
      if (err) reject(err);
      //res.status(200).json({"updatedData": updatedData});
      resolve(updatedData);

    });
  });

}


module.exports.getDataProviderMatchedAndGrouped = function (matchObject, groupObject, sortObject) {
  return new Promise(function (resolve, reject) {

    var query = [
      {$match: matchObject},
      {$group: groupObject},
      {$sort: sortObject}
    ];


    if (matchObject === undefined)
      query.splice(0, 1)
    if (groupObject === undefined)
      query.splice(1, 1)
    if (sortObject === undefined)
      query.splice(2, 1)


    DataProvider.aggregate(
      query
      , function (err, docs) {
        if (err) {
          // console.log(err)
          reject(err);
        }
        resolve(docs);
      });
  });

};




