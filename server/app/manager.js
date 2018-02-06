/*
  Markov chain manager - pulls files out of the sources directory and returns
  an array containing references to each one.
*/

const fs = require('fs');
const markov = require('./markovify.js');

let sources = [];


// called after fs reads folder contents: checks to make sure each file ends
// in .txt and reads each of them.
const getFiles = function(err, files){
  if(err){
    console.log('error: ', err);
    return;
  }
  for (var i = 0; i < files.length; i++){
    if (files[i].slice(files[i].length - 3) === 'txt'){

      console.log('loading: ', files[i]);
      fs.readFile('./source/' + files[i], 'utf8', readFile);
    }

  }
}

// if text of a file is over 400 characters long, markovify it and push it
// to the sources array.
const readFile = function(err, text){
  let timeStamp = Date.now()
  if (err){
    console.log('error: ', err)
  }
  if (text.length > 400) {
    sources.push(markov(text))
    console.log('' + Date.now() - timeStamp + 'ms:', sources[sources.length -1].getRandomSentence());
  }
}

fs.readdir('./source/', getFiles)

module.exports = sources;