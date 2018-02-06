window.onload = intMain;

function intMain(){

  // pulls out some references to html elements so I can add event listeners to them.
  let responseBox = document.getElementsByClassName('responseBox')[0];
  let quoteBox = document.getElementsByClassName('quoteBox')[0];
  let appBox = document.getElementsByClassName('appContainer')[0];
  let showFaq = document.getElementsByClassName('faq')[0];
  let faqBox = document.getElementsByClassName('faqBox')[0];
  let scoreIcon = document.getElementsByClassName('scoreIcon')[0];
  let subScore = document.getElementsByClassName('subScore')[0];
  let total = 0;
  let wrong = 0;
  let score = 0;


  // this function is so fetch.  Used for fetching new quotes.
  const fetch = function(){
    getQuote().then(function(res, err){
      quoteBox.innerText = res;
    });
  }

  // toggles faq window
  showFaq.addEventListener('click', function (){
    faqBox.classList.toggle('hide');
  });


  // records user responses.
  responseBox.addEventListener('click', function(ev){
    respond([ev.target.className.includes('real'), quoteBox.innerText]).then(function(res, err){
      // drop in case of bad response
      if (typeof res === 'string') {
        fetch();
        return;
      }
      total += 1;
      if (!res) {
        wrong += 1;
      }
      score = Math.floor((1 - Math.sqrt(Math.sqrt(Math.sqrt(wrong/total)))) * 100);
      console.log(score);
      updateScore();
      fetch();
    });
  });

  // updates score.  Forces me to question why I write comments for functions named
  // like this.
  const updateScore = function(){
    subScore.innerText = '' + score + '% chance donald is a real boy!'
    scoreIcon.style.left = '' + (score - 50) + '%';
  }

  fetch();
}


// used for getting quotes.  Returns a promise.
function getQuote(){
  return new Promise(function(resolve, err){
    let request = new XMLHttpRequest();
    request.open('get', '/api/talkToMeGoose', true);
    request.onload = function(){
      resolve(JSON.parse(request.responseText));
    }
    request.send();
  });
}

function respond(answer){
  return new Promise(function(resolve, err){
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

