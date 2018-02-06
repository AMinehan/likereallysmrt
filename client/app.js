window.onload = intMain;

function intMain(){
  let responseBox = document.getElementsByClassName('responseBox')[0];
  let quoteBox = document.getElementsByClassName('quoteBox')[0];
  let appBox = document.getElementsByClassName('appContainer')[0];

  getQuote().then(function(res, err){
    quoteBox.innerText = res;
  });
}

function getQuote(){
  return new Promise(function(resolve, err){
    let request = new XMLHttpRequest();
    request.open('get', '/talkToMeGoose', true);
    request.onload = function(){
      resolve(JSON.parse(request.responseText)[1]);
    }
    request.send();
  });
}

function post(path, data, id){
  let request = new XMLHttpRequest();

}

