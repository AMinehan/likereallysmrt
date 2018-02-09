const express = require('express');
const app = express();
const port = 80;

app.use(express.static('../client'));
app.use(express.json());
require('./config/routes.js')(app, express);

app.listen(port, () => {
  console.log('am has listening on', port);
});