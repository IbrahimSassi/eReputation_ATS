var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

//http://localhost:3000/api/scraping

/* GET users listing. */
router.get('/', function (req, res, next) {

    var url = 'http://www.mosaiquefm.net/fr/actualite-economie-tunisie/96023/creation-d-une-nouvelle-chambre-de-commerce-americaine-en-tunisie';
    var myjson={};
    request(url, function (error, response, html) {
        if (!error) {

            var $ = cheerio.load(html);
            var json = {Title:"",Article: ""};

            $('.col-xs-12.col-sm-12.col-md-8.col-lg-9.inner > .title').filter(function () {
                var data = $(this);
                Title = data.text();
                json.Title = Title;
            });

            $('.desc.descp__content').filter(function () {
                var data = $(this);
                Article = data.children().first().text();
                json.Article = Article;
            });

            res.json(json);
        }

    });


});

module.exports = router;
