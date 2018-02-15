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
  let nextObj;

  const constructify = () => {

    // build quote to 150 characters until sentence is finished
    while(textLength < 150 || currentPair !== '_start') {

      if (this.wordGroups.hasOwnProperty(currentPair) && this.wordGroups[currentPair].length > 0) {
        targetPair = Math.floor(Math.random() * this.wordGroups[currentPair].length);
        currentObj = this.wordGroups[currentPair];
        nextObj = currentObj[targetPair];

        currentSentence.push(nextObj);
        currentPair = nextObj;
      } else {
        currentPair = '_start';
        currentSentence = currentSentence.join(' ')
        construct.push(currentSentence);
        textLength += currentSentence.length;
        currentSentence = [];
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
    currentSentence = [];
    textLength = 0;

    if (!construct.every((c)=>{return this.contains.has(c)})){
      return construct.join(' ');
    } else {
      console.log('rejecting for insufficient uniqueitudes: ', construct.join(' '));
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