/**
 * Created by Ibrahim on 21/02/2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('TestFacebookScraping', {  });
});

router.get('/anywhere', function(req, res, next) {
  //Todo
});

module.exports = router;
