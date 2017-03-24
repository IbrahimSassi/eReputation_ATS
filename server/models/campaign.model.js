/**
 * Created by HP on 24/03/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**Animal Schema*/

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
      _id:false,
    }
  ],
  keywords: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId,
      },
      content: {
        type: String,
        required: true,
      },
      importance: {
        type: String,
        enum: ['high', 'low', 'medium']
      },
      creationDate: {
        type: Date,
        default: Date.now
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
// find All Animals
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

// find Animal By ID
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

// add an Animal
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

// Update Animal
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

// Delete Animal By Id
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
