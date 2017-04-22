/**
 * Created by Ibrahim on 24/03/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


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
  },

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

/**** start donut chart ****/
module.exports.avgPositivitybyCompaign = function (id) {
  console.log(id)
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {

          campaignId: {'$eq': id}
        }
      },
      {
        $group: {_id: "campaignId", positive_score: {$avg: "$contentScore.positivity"}}
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

          campaignId: {'$eq': id}
        }
      },
      {$group: {_id: "campaignId", negative_score: {$avg: "$contentScore.negativity"}}}], function (err, docs) {
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

          campaignId: {'$eq': id}
        }
      },
      {$group: {_id: "campaignId", neutral_score: {$avg: "$contentScore.neutral"}}}], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};
/**** end donut chart ****/

/****start stacked bar *****/

module.exports.SentimentalAnalysisByCompaignForToday = function (id) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 1)),
              '$lt': new Date()
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

module.exports.SentimentalAnalysisByCompaignForYesterday = function (id) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 2)),
              '$lt': new Date(new Date().setDate(new Date().getDate() - 1))
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

module.exports.SentimentalAnalysisByCompaignFortwodaysago = function (id) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 3)),
              '$lt': new Date(new Date().setDate(new Date().getDate() - 2))
            }
          }, {channelId: {'$eq': id}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};
/****end stacked bar *****/

/****start comboChart****/
module.exports.SentimentalAnalysisByCompaignandChannelFortoday = function (idcam, idch) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 1)),
              '$lt': new Date(new Date().setDate(new Date().getDate() + 1))
            }
          }, {campaignId: {'$eq': idcam}}, {channelId: {'$eq': idch}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

module.exports.SentimentalAnalysisByCompaignandChannelForyesday = function (idcam, idch) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 2)),
              '$lt': new Date()
            }
          }, {campaignId: {'$eq': idcam}}, {channelId: {'$eq': idch}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};


module.exports.SentimentalAnalysisByCompaignandChannelForoldday = function (idcam, idch) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 3)),
              '$lt': new Date(new Date().setDate(new Date().getDate() - 1))
            }
          }, {campaignId: {'$eq': idcam}}, {channelId: {'$eq': idch}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};


module.exports.SentimentalAnalysisByCompaignandChannelForooldday = function (idcam, idch) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 4)),
              '$lt': new Date(new Date().setDate(new Date().getDate() - 2))
            }
          }, {campaignId: {'$eq': idcam}}, {channelId: {'$eq': idch}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};


module.exports.SentimentalAnalysisByCompaignandChannelForoooldday = function (idcam, idch) {
  return new Promise(function (resolve, reject) {
    DataProvider.aggregate([
      {
        $match: {
          $and: [{
            dateContent: {
              '$gte': new Date(new Date().setDate(new Date().getDate() - 5)),
              '$lt': new Date(new Date().setDate(new Date().getDate() - 3))
            }
          }, {campaignId: {'$eq': idcam}}, {channelId: {'$eq': idch}}]
        }
      },
      {
        $group: {
          _id: "$channelId",
          neutral_score: {$avg: "$contentScore.neutral"},
          negative_score: {$avg: "$contentScore.negativity"},
          positive_score: {$avg: "$contentScore.positivity"}
        }
      }], function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};


/****end comboChart****/







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


module.exports.getDataProviderMatchedAndGrouped = function (matchObject, groupObject, sortObject, unwindObj) {
  return new Promise(function (resolve, reject) {

    console.log("data model")
    // console.log("matchObject",matchObject)
    var query = [
      {$match: matchObject},
      {$group: groupObject},
      {$unwind: unwindObj},
      {$sort: sortObject},
    ];

    if (matchObject == undefined)
      query[0].$match = undefined;
    if (unwindObj == undefined)
      query[2].$unwind = undefined;
    if (groupObject == undefined)
      query[1].$group = undefined;
    if (sortObject == undefined)
      query[3].$sort = undefined;


    for (var i = 0; i < query.length; i++) {
      if (Object.values(query[i])[0] == undefined) {
        query.splice(i, 1);
        i = 0;
      }
    }

    console.log("length", query.length)


    DataProvider.aggregate(
      query
      , function (err, docs) {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
  });

};




