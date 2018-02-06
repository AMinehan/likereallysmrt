const actions = require('./actions.js');

module.exports = function(app, express){
  app.get('/api/talkToMeGoose', (req, res, next)=>{
    res.send(actions.getSentence());
  });
  app.post('/api/finalAnswer', (req, res, next)=>{
    res.send(actions.finalAnswer(req));
  });
  app.get('/api/stats', (req, res, next)=>{
    res.send(actions.sendStats(req));
  });
}