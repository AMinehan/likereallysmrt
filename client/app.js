window.onload = intMain;

function intMain(){

  // pulls out some references to html elements so I can add event listeners to them.  I'm doing this
  // at the top so I only have to traverse the dom once for each element, which probably isn't helping
  // much since my app is pretty small, so I'm going to stop doing that now.
  let responseBox = document.getElementsByClassName('responseBox')[0];
  let resultBox = document.getElementsByClassName('resultBox')[0];
  let quoteBox = document.getElementsByClassName('quoteBox')[0];
  let appBox = document.getElementsByClassName('appContainer')[0];
  let showFaq = document.getElementsByClassName('faq')[0];
  let faqBox = document.getElementsByClassName('faqBox')[0];
  let scoreIcon = document.getElementsByClassName('scoreIcon')[0];
  let subScore = document.getElementsByClassName('subScore')[0];
  let attribution = document.getElementsByClassName('attribution')[0];
  let totalAnswers = 0;
  let wrongAnswers = 0;
  let score = 0;
  let awaitingResponse = false;
  let quoteExpectedTrue;

  // this function is so fetch.  Used for fetching new quotes.
  const fetch = function (){
    awaitingResponse = true;
    getQuote().then(function (res, err){
      quoteBox.innerText = res;
      awaitingResponse = false;
    });
  }

  // toggles faq window
  showFaq.addEventListener('click', function (){
    faqBox.classList.toggle('hide');
  });

  document.getElementsByClassName('next')[0].addEventListener('click', function (ev) {
    responseBox.classList.toggle('hide');
    resultBox.classList.toggle('hide');
    resultBox.classList.toggle('fadeIn');
    fetch();
  });

  // records user responses.
  responseBox.addEventListener('click', function (ev){
    let next = document.getElementsByClassName('next')[0];
    if (ev.target !== responseBox && !awaitingResponse){

      awaitingResponse = true;
      quoteExpectedTrue = ev.target.className.includes('real')

      //send answer to server, update dom when result arrives
      respond([quoteExpectedTrue, quoteBox.innerText]).then(function (res, err){
        responseBox.classList.toggle('hide');
        resultBox.classList.toggle('hide');
        resultBox.classList.toggle('fadeIn');

        // drop in case of bad response
        if (typeof res === 'string') {
          fetch();
          return;
        }
        totalAnswers += 1;
        if (!res) {
          wrongAnswers += 1;
        }
        if (quoteExpectedTrue) {
          if (res) {
            attribution.innerText = '-donald trump';
            next.style.backgroundColor = 'rgb(150, 150, 256)';
          } else {
            attribution.innerText = '-markov trump';
            next.style.backgroundColor = 'rgb(256, 150, 150)';
          }
        } else {
          if (res) {
            attribution.innerText = '-markov trump';
            next.style.backgroundColor = 'rgb(256, 150, 150)';
          } else {
            attribution.innerText = '-donald trump';
            next.style.backgroundColor = 'rgb(150, 150, 256)';
          }
        }

        score = Math.floor((1 - Math.sqrt(Math.sqrt(Math.sqrt(wrongAnswers/totalAnswers)))) * 100);
        updateScore();
      });
    }
  });

  // updates score.  Forces me to question why I write comments for functions named
  // like this.
  const updateScore = function (){
    subScore.innerText = '' + (totalAnswers - wrongAnswers) + ' out of ' + totalAnswers + ' correct!'
    scoreIcon.style.left = '' + (score - 50) + '%';
  }
  fetch();
}


// used for getting quotes.  Returns a promise.
function getQuote(){
  return new Promise(function (resolve, err){
    let request = new XMLHttpRequest();
    request.open('get', '/api/talkToMeGoose', true);
    request.onload = function (){
      resolve(JSON.parse(request.responseText));
    }
    request.send();
  });
}

function respond(answer){
  return new Promise(function (resolve, err){
    let request = new XMLHttpRequest();
    request.open('post', '/api/finalAnswer', true);
    request.setRequestHeader('content-type', 'application/json')
    request.onload = function (){
      console.log(request.responseText);
      resolve(JSON.parse(request.responseText));
    }
    request.send(JSON.stringify(answer) );
  });
}