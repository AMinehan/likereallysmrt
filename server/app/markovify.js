const parseText = require('./parser.js');

const TestString = function(text){
  this.text = text;
  let parseResult = parseText(text);
  this.sentences = parseResult[1];
  this.wordGroups = parseResult[0];
  this.contains = new Set();

  for (let i = 0; i < this.sentences.length; i++){
    this.contains.add(this.sentences[i].trim());
  }
}

TestString.prototype.getRandomSentence = function(){
  let currentPair = '_start';
  let construct = [];
  let triesLeft = 50;
  let textLength = 0;
  let targetPair, result, currentObj;


  const constructify = () => {

    while(textLength < 150 || currentPair !== '_start') {

      targetPair = Math.floor(Math.random() * this.wordGroups[currentPair]['total']);
      currentObj = this.wordGroups[currentPair]['nextPairs'];

      for (var key in currentObj){
        if (currentObj[key] > targetPair){
          construct.push(key.split(/[\"\”\“]/).join(''));

          if (key.slice(key.length - 3).match(/[\.\!\?]/)){
            currentPair = '_start'
          } else {
            currentPair = key
          }
          textLength += key.length + 1;
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

    if (!construct.every((c)=>{return this.contains.has(c)})){
      return construct.join(' ');
    }
  }

  return 'Failed to generate a unique new sentence';


}

TestString.prototype.getRealSentence = function(){
  let sentenceIndex = Math.floor(Math.random() * this.sentences.length - 2);
  if (sentenceIndex < 0) {
    sentenceIndex = 0;
  }
  let result = this.sentences[sentenceIndex];

  for (let i = 1; result.length < 150 && sentenceIndex + i < this.sentences.length; i += 1) {
    result += ' ' + this.sentences[sentenceIndex + i];
  }
  for (let i = -1; result.length < 150 && i + sentenceIndex >= 0; i -= 1) {
    result += ' ' + this.sentences[sentenceIndex - i];
  }

  return result;
}

function markovify(text){
  return new TestString(text);
}

module.exports = markovify