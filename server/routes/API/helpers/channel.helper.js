/**
 * Created by Ibrahim on 22/03/2017.
 */

var request = require('request');

const BASE_URL = "http://www.similarweb.com/website/suggestcompetitors?site=";
const LIMIT = 5;


exports.getSimilarWebsite = function (req, res, next) {

  var url = BASE_URL + req.params.url + '&count=' + LIMIT;
  req.pipe(request(url)).pipe(res);

};
