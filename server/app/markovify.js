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
    result = construct.join(' ');

    if (!this.contains.has(result) && result.length < 400){
      return result;
    }
  }

  return 'Failed to generate a unique new sentence';


}

TestString.prototype.getRealSentence = function(){
  let i = randomIndex = Math.floor(Math.random() * this.text.length - 200);
  let startIndex, endIndex;

  while ((!this.text[i].match(/[A-Z]/) || !(isStartOfSentence(this.text, i))) && i > 0){
    i -= 1;
  }
  startIndex = i;
  i = randomIndex;

  while ((!isEndOfSentence(this.text, i) || i - startIndex < 150) && i < this.text.length){
    i += 1;
  }
  endIndex = i;

  return this.text.slice(startIndex, endIndex + 1).replace(/\n/g, ' ').split(/[\"\”\“]/).join('');
}

function isStartOfSentence(str, index){
  let endIndicator = str.slice(index - 6, index).match(/[\!\?\.]/gi);
  if (str[index - 1].match(/[a-z]/i) || (endIndicator && endIndicator.length > 1)){
    return false
  }
  return true;
}

function isEndOfSentence(str, index){
  if (str[index - 1].toUpperCase === str[index - 1] && str[index - 2].match(/\.\?\!/)){
    return false;
  }
  return str[index].match(/[\.\!\?]/);
}

function markovify(text){
  return new TestString(text);
}

module.exports = markovify