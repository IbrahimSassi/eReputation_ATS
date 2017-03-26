/**
 * Created by HP on 24/03/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**Campaign Schema*/

/*object Campaign example : http://www.jsoneditoronline.org/?id=23467b85d3d9b5b5b5a04cb21f0daea5 */

var campaignSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  state: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  channels: [
    {
      channelId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      _id: false,
    }
  ],
  keywords: [
    {
      content: {
        type: String,
        required: true,
      },
      importance: {
        type: String,
        enum: ['high', 'low', 'medium'],
        required: true
      },
      creationDate: {
        type: Date,
        default: Date.now
      },
      state:{
        type: String,
        enum:['active','inactive'],
        default:'active'
      }
    }
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  location: [
    {
      latitude: Number,
      longitude: Number,
      _id: false,
    }
  ],
});


var myCampaign = module.exports = mongoose.model('campaigns', campaignSchema);

/**---------------------CRUD METHODS-----------------------**/
// find All Campaign
module.exports.findAllCampaigns = function () {
  return new Promise(function (resolve, reject) {
    myCampaign.find({}, function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

// find Campaign By ID
module.exports.findCampaignById = function (id) {
  return new Promise(function (resolve, reject) {
    myCampaign.find({_id: id}, function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

// add an Campaign
module.exports.saveCampaign = function (campaignToSave) {
  return new Promise(function (resolve, reject) {
    campaignToSave.save(function (err) {
      if (err) {
        reject(err);
      }

      myCampaign.findAllCampaigns().then(function (data) {
        resolve(data);
      });
    });
  });
};

// Update Campaign
module.exports.updateCampaign = function (id, updatedAnimal) {
  return new Promise(function (resolve, reject) {
    myCampaign.findByIdAndUpdate(id, {$set: updatedAnimal}, {new: true}, function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

// Delete Campaign By Id
module.exports.removeCampaign = function (id) {
  return new Promise(function (resolve, reject) {
    myCampaign.remove({_id: id}, function (err) {
      if (err) {
        reject(err);
      }
      myCampaign.findAllCampaigns().then(function (data) {
        resolve(data);
      });
    })
  });
};


/**---------------------CRUD METHODS Keywords-----------------------**/

//find all keywords from campaign

module.exports.findAllKeywordsFromCampaign = function (campaignId) {
  return new Promise(function (resolve, reject) {
    myCampaign.find({_id: campaignId}, function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    }).select({"keywords": 1, "_id": 0});
  });
};

//find keywords by id from campaign

module.exports.findKeywordsByIdFromCampaign = function (campaignId, keywordId) {
  return new Promise(function (resolve, reject) {
    myCampaign.find({_id: campaignId, keywords: {$elemMatch: {_id: keywordId}}}, function (err, docs) {
      if (err) {
        reject(err);
      }
      resolve(docs);
    }).select({"keywords.$": 1, "_id": 0});
  });
};

//remove keyword by id from campaign

module.exports.removeKeywordsByIdFromCampaign = function (campaignId, keywordId) {
  return new Promise(function (resolve, reject) {
    myCampaign.findByIdAndUpdate(campaignId, {$pull: {keywords: {_id: keywordId}}}, function (err, docs) {
      if (err) {
        reject(err);
      }
      myCampaign.findAllKeywordsFromCampaign(campaignId).then(function (data) {
        resolve(data);
      });
    });
  });
};

//add keyword in campaign

module.exports.addKeywordsByIdFromCampaign = function (campaignId, keyword) {
  return new Promise(function (resolve, reject) {
    myCampaign.findByIdAndUpdate(campaignId, {$push: {keywords: keyword}}, function (err, docs) {
      if (err) {
        reject(err);
      }
      myCampaign.findAllKeywordsFromCampaign(campaignId).then(function (data) {
        resolve(data);
      });
    });
  });
};

// update keyword in campaign
module.exports.updateKeywordsByIdFromCampaign = function (campaignId, keywordId, updatedKeyword) {
  return new Promise(function (resolve, reject) {

    myCampaign.find({_id: campaignId, "keywords._id": keywordId}, function (err, docs) {

      if (err) {
        reject(err);
      }

      myCampaign.update({_id: campaignId, "keywords._id": keywordId}, {

        $set: {

          "keywords.$.content": updatedKeyword.content !== undefined ? updatedKeyword.content : docs[0].keywords[0].content,
          "keywords.$.importance": updatedKeyword.importance !== undefined ? updatedKeyword.importance : docs[0].keywords[0].importance,
          "keywords.$.state": updatedKeyword.state !== undefined ? updatedKeyword.state : docs[0].keywords[0].state,
        }
      }, function (err, docs) {
        if (err) {
          reject(err);
        }
        myCampaign.findAllKeywordsFromCampaign(campaignId).then(function (data) {
          resolve(data);
        });
      });


    }).select({"keywords.$": 1, "_id": 0});


  });
};
