const actions = require('./actions.js');

module.exports = function(app, express){
  app.get('/talkToMeGoose', (req, res, next)=>{
    res.send(actions.getSentence());
  });
  app.post('/finalAnswer', (req, res, next)=>{
    res.send(actions.finalAnswer(req));
  });
  app.get('/stats', (req, res, next)=>{
    res.send(actions.sendStats(req));
  });
}