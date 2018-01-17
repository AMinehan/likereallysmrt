const define = function(obj, key){
  if (!obj.hasOwnProperty(key)){
    obj[key] = {total: 0, nextPairs: {}}
  }
}

const splitIntoSentences = function(text){
  let result = [];
  let lastIndex = 0;

  for (let i = 0; i < text.length; i++){
    if (text[i].match(/[\.\!\?]/) && (text[i + 1] === ' ' || i === text.length - 1)){
      result.push(text.slice(lastIndex, i + 1));
      lastIndex = i + 2;
    }
  }
  return result;
}

const addPair = function(obj, prev, pair){
  obj[prev]['total'] += 1;
  if (obj[prev]['nextPairs'].hasOwnProperty(pair)){
    obj[prev]['nextPairs'][pair] += 1;
  } else {
    obj[prev]['nextPairs'][pair] = 1;
  }
}

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

    addPair(wordPairs, '_start', words[0] + ' ' + words[1]);

    for (var j = 3; j < words.length; j++){
      lastPair = words[j - 3] + ' ' + words[j - 2];
      currentPair = words[j - 1] + ' ' + words[j]
      define(wordPairs, lastPair);
      addPair(wordPairs, lastPair, currentPair);
    }

    lastPair = words[j - 3] + ' ' + words[j - 2];
    currentPair = words[j - 1];
    define(wordPairs, lastPair);
    addPair(wordPairs, lastPair, currentPair);
  }



  return wordPairs;
}

module.exports = parseText;