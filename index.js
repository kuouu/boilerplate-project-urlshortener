require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const createData = require('./utils').createData;
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  createData((err, data) => {
    if (err) return res.json({ error: 'invalid url' })
    res.json({ 
      original_url: data.original_url, 
      short_url: data._id 
    });
  }, url);
});

const findData = require('./utils').findData;
app.get('/api/shorturl/:num', function(req, res) {
  const id = req.params.num;
  findData((err, data) => {
    if (err) return console.error(err);
    res.redirect(data.original_url)
  }, id);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
