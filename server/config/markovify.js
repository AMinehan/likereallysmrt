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
  let finished = false;
  let triesLeft = 10;
  let targetPair, result, currentObj;

  const constructify = () => {
    while(construct.length < 13 || currentPair !== '_start') {
      console.log(currentPair)
      targetPair = Math.floor(Math.random() * this.wordGroups[currentPair]['total']);
      currentObj = this.wordGroups[currentPair]['nextPairs'];

      for (var key in currentObj){
        if (currentObj[key] > targetPair){
          construct.push(key);

          if (key.match(/[\.\!\?]/)){
            currentPair = '_start'
          } else if (key.split(' ').length === 1){
            currentPair = '_start';
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

    //this last condition is so hacky

    if (!this.contains.has(result) && result.length < 400 && !result.contains('undefined')){
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