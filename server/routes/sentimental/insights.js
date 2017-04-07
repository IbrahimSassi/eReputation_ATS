/**
 * Created by ninou on 4/6/2017.
 */
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/:compaignId', function(req, res, next) {






  res.render('index', {  });
});

module.exports = router;
