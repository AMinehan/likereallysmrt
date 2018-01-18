const fs = require('fs');

let sources = require('./../app/manager.js');
let recentConnections = {};
let stats = {};
let recentstrings = {};

const verify = function(id){
  if (Date.now() - recentConnections[id] < 500) {
    return false;
  }
  recentConnections[id] = Date.now();
  return true;
}

const newId = function(){
  stats['connections'] += 1;
  return JSON.stringify(Date.now())
}

const parseStats = function(err, text){
  if (err) {
    stats['connections'] = 0;
    stats['guesses'] = 0;
    stats['correct'] = 0;
    stats['falsePositives'] = 0;
    stats['falseNegatives'] = 0;
  } else {
    text = text.split('\n').map(function(c){return c.split(':')});
    stats['connections'] = text[0][1];
    stats['guesses'] = text[1][1];
    stats['correct'] = text[2][1];
    stats['falsePositives'] = text[3][1];
    stats['falseNegatives'] = text[4][1];
  }
}

module.exports = {
  finalAnswer: function(req){

  },
  sendStats: function(req){
    console.log(req)
    return JSON.stringify(stats);
  },
  getSentence: function(req){

  }
}

fs.readFile('./../stats/stats.txt','utf8', parseStats);