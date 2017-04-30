/**
 * Created by ninou on 4/27/2017.
 */

var dataProvider = require('../../../models/dataProvider/dataProvider.model');
var translate = require('google-translate-api');
var myRequest = require('request');

var count = 0;


function SentimentalForSpecificProvider(providerType) {



  function translateFN() {
    count++;
    var positive = null;
    var negative = null;
    var neutral = null;
    dataProvider.findNulledScoreWithDataproviderType(providerType).then(function (data) {



      if (data.content) {

        var textToAnalyse = data.content;
        console.log('First Text State: ', textToAnalyse)
        textToAnalyse = textToAnalyse.replaceAll("\"", " ");
        textToAnalyse = textToAnalyse.replace(/(\r\n|\n|\r)/gm, " ")
        textToAnalyse = textToAnalyse.replaceAll("'", " ");
        textToAnalyse = textToAnalyse.replaceAll(",", " ");
        textToAnalyse = textToAnalyse.replaceAll("@", " ");
        textToAnalyse = textToAnalyse.replaceAll(".", " ");
        textToAnalyse = textToAnalyse.replaceAll("  ", " ");
        textToAnalyse = textToAnalyse.replaceAll("   ", " ");
        textToAnalyse = textToAnalyse.replaceAll("“", " ");
        textToAnalyse = textToAnalyse.replaceAll("”", " ");
        textToAnalyse = textToAnalyse.replaceAll("’", " ");
        console.log('Final Text State: ', textToAnalyse);

        translate(textToAnalyse, {to: 'en'}).then(function (result) {
          console.log(result.text);
          myRequest({
            url: 'http://apidemo.theysay.io/api/v1/sentiment',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"text": "' + result.text + '", "level": "sentence"}'
          }, function (error, response, body) {
            if (error) {
              console.log("fama erreurrrrrrr");
              console.log(error);
              console.log("Error in The sentiment API");
            } else {


              //If a character make an error
              if (response.statusCode == 400) {
                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  if(count==400)
                  {
                    setTimeout(function(){ translateFN();
                      count=0}, 300);
                  }
                  else
                  {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }

              else {

                console.log(response.statusCode, body);
                console.log(JSON.parse(body)[0].sentiment);


                var resultsLenght = JSON.parse(body).length;
                console.log('len:', resultsLenght)
                for (var i = 0; i < resultsLenght; i++) {
                  positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
                  negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
                  neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
                }



                var scoreResults = {positivity: positive, negativity: negative, neutral: neutral}
                console.log('scoreResults: ', scoreResults);

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  if(count==400)
                  {
                    setTimeout(function(){ translateFN();
                      count=0}, 300);
                  }
                  else
                  {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }
            }
          });

        }).catch(function (err) {


          var textToAnalyse = data.content;
          console.log('First Text State: ', textToAnalyse)
          textToAnalyse = textToAnalyse.replaceAll("\"", " ");
          textToAnalyse = textToAnalyse.replace(/(\r\n|\n|\r)/gm, " ")
          textToAnalyse = textToAnalyse.replaceAll("'", " ");
          textToAnalyse = textToAnalyse.replaceAll(",", " ");
          textToAnalyse = textToAnalyse.replaceAll("@", " ");
          textToAnalyse = textToAnalyse.replaceAll(".", " ");
          textToAnalyse = textToAnalyse.replaceAll("  ", " ");
          textToAnalyse = textToAnalyse.replaceAll("   ", " ");
          textToAnalyse = textToAnalyse.replaceAll("“", " ");
          textToAnalyse = textToAnalyse.replaceAll("”", " ");
          textToAnalyse = textToAnalyse.replaceAll("’", " ");
          console.log('Final Text State: ', textToAnalyse);




          myRequest({
            url: 'http://apidemo.theysay.io/api/v1/sentiment',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"text": "' + textToAnalyse + '", "level": "sentence"}'
          }, function (error, response, body) {
            if (error) {
              console.log(error);

              console.log("Error in The sentiment API");

            } else {

              if (response.statusCode == 400) {
                console.log("fama erreurrrrrrr");
                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  if(count==400)
                  {
                    setTimeout(function(){ translateFN();
                      count=0}, 120000);
                  }
                  else
                  {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }
              else {

                console.log(response.statusCode, body);
                console.log(JSON.parse(body)[0].sentiment);


                var resultsLenght = JSON.parse(body).length;
                console.log('len:', resultsLenght)
                for (var i = 0; i < resultsLenght; i++) {
                  positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
                  negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
                  neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
                }


                var scoreResults = {positivity: positive, negativity: negative, neutral: neutral}
                console.log('scoreResults: ', scoreResults);


                dataProvider.updateScore(data, scoreResults).then(function (result) {


                  if(count==400)
                  {
                    setTimeout(function(){ translateFN();
                    count=0}, 120000);
                  }
                  else
                  {
                    translateFN();
                  }

                }).catch(function (err) {
                });
              }
            }
          });


        });
      }

      else {

        var scoreResults = {
          positivity: null,
          negativity: null,
          neutral: null
        }
        console.log("errrr", scoreResults)

        dataProvider.updateScore(data, scoreResults).then(function (result) {
          if(count==400)
          {
            setTimeout(function(){ translateFN();
              count=0}, 120000);
          }
          else
          {
            translateFN();
          }
        }).catch(function (err) {
        });

      }


    }).catch(function (err) {
      console.log("Error in Find Nulled Score");

    });
  }
  translateFN();

}

module.exports = {
  SentimentalForSpecificProvider: SentimentalForSpecificProvider,

};
