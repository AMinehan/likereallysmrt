const express = require('express');
const app = express()

app.use(express.static('../client'));
require('./config/routes.js')(app, express);

app.get('/test', (req, res, next)=>{
  console.log('test');
  res.send('hi');
})

app.listen(8080, () => {
  console.log('am listening on 8080')
});