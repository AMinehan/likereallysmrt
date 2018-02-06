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
    stats = JSON.parse(text)
  }
}

const saveStats = function(){
  fs.writeFile('./../stats/stats.txt', 'utf8', JSON.stringify(stats), (err)=>{
    if (err) {
      console.log('stats not saved!')
    }
    console.log('stats saved!')
  });
}

module.exports = {
  finalAnswer: function(req){

  },
  sendStats: function(req){
    return JSON.stringify(stats);
  },
  getSentence: function(req){
    let truthiness = Math.floor(Math.random() * 2);
    let targetSource = Math.floor(Math.random() * sources.length);
    let result = [truthiness];

    if (truthiness){
      result.push(sources[targetSource].getRandomSentence());
    } else {
      result.push(sources[targetSource].getRealSentence());
    }
    return JSON.stringify(result);
  }
}

fs.readFile('./../stats/stats.txt','utf8', parseStats);