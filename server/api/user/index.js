'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');

var router = express.Router();


//Pour la securisation par la suite
//router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id', controller.show);

router.post('/', controller.create);

module.exports = router;
