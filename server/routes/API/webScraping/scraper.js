/**
 * Created by HP on 11/03/2017.
 */
var requestSender = require('request');
var cheerio = require('cheerio');
/**fun*/
module.exports =
  {
    scrapeArticle: function (url, allResult, obj) {
      return new Promise(function (resolve, reject) {
        requestSender(url, function (error, response, html) {

          if (!error) {
            var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
            var STYLE_REGEX = /<style\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/style>/gi;
            var HEADER_REGEX = /<header\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/header>/gi;
            var FOOTER_REGEX = /<footer\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/footer>/gi;


            html = html.replace(SCRIPT_REGEX, "");
            html = html.replace(STYLE_REGEX, "");
            html = html.replace(HEADER_REGEX, "");
            html = html.replace(FOOTER_REGEX, "");

            html = html.replace(/\n/g, "");
            html = html.replace(/\t/g, "");
            html = html.replace(/\r/g, "");
            // var word =link.description.split(" ")[8 - 1];
            // console.log("OLAA : " + word);
            var $ = cheerio.load(html);
            // var foundin = $('*:contains(' + word + ')').next().text();
            // console.log("OLAAOMAAKLAKL : " + foundin);
            var t = $('html *').contents().map(function () {
              return (this.type === 'text') ? $(this).text() : '';
            }).get().join(' ');
            obj.postBody = t;
            allResult.push(obj);
            resolve(allResult);
          }

        });
      });
    }

  }

/**end fun*/
