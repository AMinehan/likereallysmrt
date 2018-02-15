/*
  defines api functions and keeps track of stats
*/
"use strict";

const fs = require("fs");

let sources = require("./../app/manager.js");
let stats = {};
let quoteHistory = {};

// loads stats from a file
const loadStats = function(err, text){

  if (err) {
    console.log("error loading file: ", err);
    stats.guesses = 0;
    stats.correct = 0;
    stats.falseNegatives = 0;
    stats.falsePositives = 0;
  } else {
    stats = JSON.parse(text);
    stats.guesses = stats.guesses || 0;
    stats.correct = stats.correct || 0;
    stats.falseNegatives = stats.falseNegatives || 0;
    stats.falsePositives = stats.falsePositives || 0;
  }
}

// writes stats to a file
const saveStats = function(){
  fs.writeFile("./stats/stats.txt", JSON.stringify(stats), {"encoding": "utf8"}, (err)=>{
    if (err) {
      console.log("stats not saved!", err)
    } else {
      console.log("stats saved!")
    }
  });
}

setInterval(saveStats, 60000);

//defines functions to be used with certain routes
module.exports = {
  finalAnswer: function(req){
    let answer = req.body;
    if (quoteHistory.hasOwnProperty(answer[1])) {
      stats.guesses += 1;
      if (quoteHistory[answer[1]] == answer[0]) {
        stats.correct += 1;
      } else if (answer[0] == true) {
        stats.falsePositives += 1;
      } else {
        stats.falseNegatives += 1;
      }
      return "" + (quoteHistory[answer[1]] == answer[0]);
    }
    return JSON.stringify("quote expired");
  },
  sendStats: function(req){
    return JSON.stringify(stats);
  },
  getSentence: function(req){
    let truthiness = !!Math.floor(Math.random() * 2);
    let targetSource = Math.floor(Math.random() * sources.length);
    let result = "";

    if (!truthiness){
      result = sources[targetSource].getRandomSentence();
    } else {
      result = sources[targetSource].getRealSentence();
    }
    quoteHistory[result] = truthiness;

    // sets a timer to delete quotes from history after 10 minutes.
    setTimeout(function(){
      delete quoteHistory[result];
    }, 600000)

    return JSON.stringify(result);
  }
}

fs.readFile("./stats/stats.txt","utf8", loadStats);