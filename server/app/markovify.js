const parseText = require('./parser.js');

// main class for each markov object.  This is what gets pushed into the sources array.

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


// constructs a random sentence going off two word pairs.  Triesleft probably isn't needed
// anymore but adds a little protection against getting stuck in an infinite loop due to a
// bad source file
TestString.prototype.getRandomSentence = function(){
  let currentPair = '_start';
  let construct = [];
  let triesLeft = 100;
  let textLength = 0;
  let targetPair, result, currentObj;
  let currentSentence = [];

  const constructify = () => {

    // build quote to 150 characters until sentence is finished
    while(textLength < 150 || currentPair !== '_start') {

      targetPair = Math.floor(Math.random() * this.wordGroups[currentPair]['total']);
      currentObj = this.wordGroups[currentPair]['nextPairs'];

      for (var key in currentObj){
        if (currentObj[key] > targetPair){
          currentSentence.push(key);

          if (key.slice(key.length - 3).match(/[\.\!\?]/)){
            currentPair = '_start'
            construct.push(currentSentence.join(' '))
          } else {
            currentPair = key;
          }
          textLength += key.length + 1;
          break;
        } else {
          targetPair -= currentObj[key];
        }
      }
    }
  }


  // tries to put together a valid sentence.  If every sentence in the construct is a
  // word-for-word match with a sentence in the source text, throw it away and start over.
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


// to get a real sentence, pick a random sentence out of the source text and add subsequent
// sentences until a desired length is reached.  If EOF is reached, start adding previous sentences.
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


// Exports module as a function
function markovify(text){
  return new TestString(text);
}

module.exports = markovify;