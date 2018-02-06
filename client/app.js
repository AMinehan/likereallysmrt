window.onload = intMain;

function intMain(){
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

  const fetch = function(){
    getQuote().then(function(res, err){
      quoteBox.innerText = res;
    });
  }

  showFaq.addEventListener('click', function (){
    faqBox.classList.toggle('hide');
  });

  responseBox.addEventListener('click', function(ev){
    respond([ev.target.className.includes('real'), quoteBox.innerText]).then(function(res, err){
      if (typeof res === 'string') {
        return;
      }
      total += 1;
      if (!res) {
        wrong += 1;
      }
      score = Math.floor((1 - Math.sqrt(Math.sqrt(wrong/total))) * 100);
      console.log(score);
      updateScore();
      fetch();
    });
  });

  const updateScore = function(){
    subScore.innerText = '' + score + '% chance donald is a real boy!'
    scoreIcon.style.left = '' + (score - 50) + '%';
  }

  fetch();
}

function getQuote(){
  return new Promise(function(resolve, err){
    let request = new XMLHttpRequest();
    request.open('get', '/talkToMeGoose', true);
    request.onload = function(){
      resolve(JSON.parse(request.responseText));
    }
    request.send();
  });
}

function respond(answer){
  return new Promise(function(resolve, err){
    let request = new XMLHttpRequest();
    request.open('post', '/finalAnswer', true);
    request.setRequestHeader('content-type', 'application/json')
    request.onload = function (){
      console.log(request.responseText);
      resolve(JSON.parse(request.responseText));
    }
    request.send(JSON.stringify(answer) );
  });
}

