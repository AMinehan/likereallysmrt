const parseText = require('./parser.js');

const TestString = function(text){
  this.text = text;
  this.wordGroups = parseText(text);
  let sentences = text.split(/[\.\n\!\?]/);
  this.contains = new Set()
  for (let i = 0; i < sentences.length; i++){
    this.contains.add(sentences[i]);
  }
}

TestString.prototype.getRandomSentence = function(){
  let currentPair = '_start';
  let construct = [];
  let triesLeft = 10;
  let targetPair, result, currentObj;


  const constructify = () => {

    while(construct.length < 13 || currentPair !== '_start') {

      targetPair = Math.floor(Math.random() * this.wordGroups[currentPair]['total']);
      currentObj = this.wordGroups[currentPair]['nextPairs'];

      for (var key in currentObj){
        if (currentObj[key] > targetPair){
          construct.push(key.split(/[\'\"\”\“]/).join(''));

          if (key.slice(key.length - 3).match(/[\.\!\?]/)){
            currentPair = '_start'
          } else {
            currentPair = key
          }
          break;
        } else {
          targetPair -= currentObj[key]
        }
      }
    }
  }



  while (triesLeft > 0){
    construct = [];
    triesLeft -= 1;
    currentPair = '_start';
    constructify();
    result = construct.join(' ');

    if (!this.contains.has(result) && result.length < 400){
      return result;
    }
  }

  return 'Failed to generate a unique new sentence';


}

TestString.prototype.getRealSentence = function(){
  let randomIndex = Math.floor(Math.random() * this.sentences.length);
  return this.sentences[randomIndex]
}

function markovify(text){
  return new TestString(text);
}

module.exports = markovify