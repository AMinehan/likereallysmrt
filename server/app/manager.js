const fs = require('fs');
const markov = require('./markovify.js');

let sources = [];

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