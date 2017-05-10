/**
 * Created by ninou on 4/27/2017.
 */

var dataProvider = require('../../../models/dataProvider/dataProvider.model');
var translate = require('google-translate-api');
var myRequest = require('request');
var senti = require('senti');

var count = 0;
var countForTweetType = 0;


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
                  if (count == 400) {
                    setTimeout(function () {
                      translateFN();
                      count = 0
                    }, 300);
                  }
                  else {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }

              else {
                if (JSON.parse(body)[0] !== undefined) {


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


                  dataProvider.updateScore(data, scoreResults).then(function (result) {
                    if (count == 400) {
                      setTimeout(function () {
                        translateFN();
                        count = 0
                      }, 300);
                    }
                    else {
                      translateFN();
                    }
                  }).catch(function (err) {
                  });
                }
                else {
                  senti(data.content.replace('@', ''), function (item) {
                    positive = positive + item.probability.pos * 100;
                    negative = negative + item.probability.neg * 100;
                    neutral = neutral + item.probability.neutral * 100;
                    var scoreResults = {positivity: positive, negativity: negative, neutral: neutral};


                    dataProvider.updateScore(data, scoreResults).then(function (result) {
                      translateFN()
                      // res.status(200).json({"updatedData": result});
                    }).catch(function (err) {
                      //   res.status(400).json({"Error": "Error in update"})
                    });
                  }, true);
                }
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

                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  if (count == 400) {
                    setTimeout(function () {
                      translateFN();
                      count = 0
                    }, 120000);
                  }
                  else {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }
              else {
                if (JSON.parse(body)[0] !== undefined) {
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


                    if (count == 400) {
                      setTimeout(function () {
                        translateFN();
                        count = 0
                      }, 120000);
                    }
                    else {
                      translateFN();
                    }

                  }).catch(function (err) {
                  });
                }
                else {
                  senti(data.content.replace('@', ''), function (item) {
                    positive = positive + item.probability.pos * 100;
                    negative = negative + item.probability.neg * 100;
                    neutral = neutral + item.probability.neutral * 100;
                    var scoreResults = {positivity: positive, negativity: negative, neutral: neutral};
                    console.log('scoreResults: ', scoreResults);

                    dataProvider.updateScore(data, scoreResults).then(function (result) {
                      translateFN()
                      // res.status(200).json({"updatedData": result});
                    }).catch(function (err) {
                      //   res.status(400).json({"Error": "Error in update"})
                    });
                  }, true);
                }
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


        dataProvider.updateScore(data, scoreResults).then(function (result) {
          if (count == 400) {
            setTimeout(function () {
              translateFN();
              count = 0
            }, 120000);
          }
          else {
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


function SentimentalForSpecificProviderByTweetType(providerType,tweetType) {


  function translateFN() {
    countForTweetType++;
    var positive = null;
    var negative = null;
    var neutral = null;
    dataProvider.findNulledScoreWithDataproviderTypeAndTweetType(providerType,tweetType).then(function (data) {


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
                  if (countForTweetType == 400) {
                    setTimeout(function () {
                      translateFN();
                      countForTweetType = 0
                    }, 300);
                  }
                  else {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }

              else {
                if (JSON.parse(body)[0] !== undefined) {


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


                  dataProvider.updateScore(data, scoreResults).then(function (result) {
                    if (countForTweetType == 400) {
                      setTimeout(function () {
                        translateFN();
                        countForTweetType = 0
                      }, 300);
                    }
                    else {
                      translateFN();
                    }
                  }).catch(function (err) {
                  });
                }
                else {
                  senti(data.content.replace('@', ''), function (item) {
                    positive = positive + item.probability.pos * 100;
                    negative = negative + item.probability.neg * 100;
                    neutral = neutral + item.probability.neutral * 100;
                    var scoreResults = {positivity: positive, negativity: negative, neutral: neutral};


                    dataProvider.updateScore(data, scoreResults).then(function (result) {
                      translateFN()
                      // res.status(200).json({"updatedData": result});
                    }).catch(function (err) {
                      //   res.status(400).json({"Error": "Error in update"})
                    });
                  }, true);
                }
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

                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  if (countForTweetType == 400) {
                    setTimeout(function () {
                      translateFN();
                      countForTweetType = 0
                    }, 120000);
                  }
                  else {
                    translateFN();
                  }
                }).catch(function (err) {
                });
              }
              else {
                if (JSON.parse(body)[0] !== undefined) {
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


                    if (countForTweetType == 400) {
                      setTimeout(function () {
                        translateFN();
                        countForTweetType = 0
                      }, 120000);
                    }
                    else {
                      translateFN();
                    }

                  }).catch(function (err) {
                  });
                }
                else {
                  senti(data.content.replace('@', ''), function (item) {
                    positive = positive + item.probability.pos * 100;
                    negative = negative + item.probability.neg * 100;
                    neutral = neutral + item.probability.neutral * 100;
                    var scoreResults = {positivity: positive, negativity: negative, neutral: neutral};
                    console.log('scoreResults: ', scoreResults);

                    dataProvider.updateScore(data, scoreResults).then(function (result) {
                      translateFN()
                      // res.status(200).json({"updatedData": result});
                    }).catch(function (err) {
                      //   res.status(400).json({"Error": "Error in update"})
                    });
                  }, true);
                }
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


        dataProvider.updateScore(data, scoreResults).then(function (result) {
          if (countForTweetType == 400) {
            setTimeout(function () {
              translateFN();
              countForTweetType = 0
            }, 120000);
          }
          else {
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
  SentimentalForSpecificProviderByTweetType : SentimentalForSpecificProviderByTweetType

};
