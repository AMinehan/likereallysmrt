// checks if a word pair key is a property on object.  If not, makes it a property.
const define = function(obj, key){
  if (!obj.hasOwnProperty(key)){
    obj[key] = [];
  }
}

// iterates through and splits the source text into sentences.  Line 14 is
// a nightmare and tries to account for abbreviations and titles.
const splitIntoSentences = function(text){
  let result = [];
  let lastIndex = 0;

  for (let i = 0; i < text.length; i++){
    if (text[i].match(/[\.\!\?]/) && (((text[i + 1] === ' ' || text[i + 1] === '\n') && text[i - 2] !== '.'  && !text.slice(i - 4, i).match(/[A-Z]/)) || i === text.length - 1)){

      // trim whitespace and remove characters that could look out of place in a fake quote.
      result.push(text.slice(lastIndex, i + 1).trim().replace(/[\"\”\“]/g, ''));
      lastIndex = i + 2;
    }
    if (text[i].match(/[\n]/)) {
      lastIndex = i + 1;
    }
  }
  console.log('sentences: ', result.length)
  return result;
}

const addPair = function(obj, prev, pair){
  obj[prev].push(pair);
}

// takes source text, splits into sentences, iterates through sentences and
// adds word pairings to the wordpairs object, which is used to generate random
// sentences.
const parseText = function(text){
  let wordPairs = {};
  let currentPair;
  let lastPair = '_start';
  let holdingValue;
  let currentWord = '';
  let sequenceContainsLetter = false;
  let sentences = splitIntoSentences(text);
  let words, currentObj;

  define(wordPairs, '_start');

  for (let i = 0; i < sentences.length; i++){
    words = sentences[i].split(' ').filter((c)=>c.length);

    if (words.length > 2){

      addPair(wordPairs, '_start', words[0] + ' ' + words[1]);
      addPair(wordPairs, '_start', words[0]);

      define(wordPairs, words[0]);
      addPair(wordPairs, words[0], words[1] + ' ' + words[2]);
    } else {
      addPair(wordPairs, '_start', words.join(' '));
    }

    for (var j = 3; j < words.length; j++){
      lastPair = words[j - 3] + ' ' + words[j - 2];
      currentPair = words[j - 1] + ' ' + words[j];
      define(wordPairs, lastPair);
      addPair(wordPairs, lastPair, currentPair);
    }

    lastPair = words[j - 3] + ' ' + words[j - 2];
    currentPair = words[j - 1];
    define(wordPairs, lastPair);
    addPair(wordPairs, lastPair, currentPair);
    define(wordPairs, words[j - 1]);
    define(wordPairs, words[j - 2] + ' ' + [j - 1]);
  }

  return [wordPairs, sentences];
}

module.exports = parseText;