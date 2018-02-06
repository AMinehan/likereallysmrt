const fs = require('fs');

let sources = require('./../app/manager.js');
let stats = {};
let quoteHistory = {};

const loadStats = function(err, text){
  if (err) {
    console.log('error loading file: ', err);
    stats['guesses'] = 0;
    stats['correct'] = 0;
  } else {
    stats = JSON.parse(text)
  }
}

const saveStats = function(){
  fs.writeFile('./stats/stats.txt', JSON.stringify(stats), {'encoding': 'utf8'}, (err)=>{
    if (err) {
      console.log('stats not saved!', err)
    } else {
      console.log('stats saved!')
    }
  });
}

setInterval(saveStats, 60000);

module.exports = {
  finalAnswer: function(req){
    let answer = req.body;
    stats.guesses += 1;
    if (quoteHistory[answer[1]] == answer[0]) {
      stats.correct += 1;
    }
    console.log(stats);
    if (quoteHistory.hasOwnProperty(answer[1])) {
      return '' + (quoteHistory[answer[1]] == answer[0]);
    }
    return '\"quote expired\"';
  },
  sendStats: function(req){
    return JSON.stringify(stats);
  },
  getSentence: function(req){
    let truthiness = !!Math.floor(Math.random() * 2);
    let targetSource = Math.floor(Math.random() * sources.length);
    let result = '';

    if (!truthiness){
      result = sources[targetSource].getRandomSentence();
    } else {
      result = sources[targetSource].getRealSentence();
    }
    quoteHistory[result] = truthiness;

    setTimeout(function(){
      delete quoteHistory[result];
    }, 6000000)

    return JSON.stringify(result);
  }
}

fs.readFile('./stats/stats.txt','utf8', loadStats);