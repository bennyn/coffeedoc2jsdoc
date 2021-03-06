const bodyParser = require('body-parser');
const coffeedoc2jsdoc = require('./index');
const express = require('express');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const port = process.env.PORT || 8080;

app.post('/convert', (request, response) => {
  const code = request.body.code;

  response.setHeader('Content-Type', 'application/text');

  if (code) {
    let comments = [];

    try {
      comments = coffeedoc2jsdoc.Converter.toJSDoc(code);
    } catch (error) {
    }

    comments.forEach((comment) => {
      response.write(comment.getJSDoc());
      response.write('\n');
    });
  }

  response.end();
});

app.get('/', function(request, response) {
  response.sendFile('public/index.html');
});

const server = app.listen(port, () => {
  const port = server.address().port;
  console.log(`Server is running on http://localhost:${port}/`);
});
