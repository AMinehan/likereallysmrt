const express = require('express');
const app = express()

app.use(express.static('../client'));
app.use(express.json())
require('./config/routes.js')(app, express);

app.listen(8080, () => {
  console.log('am has listening on 8080')
});