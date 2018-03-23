const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const logger = require('morgan');
const axios = require('axios');

let db = require('./models');
let PORT = process.env.PORT || 3000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
let app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.Promise = Promise;
mongoose.connect('MONGODB_URI');

app.listen(PORT, function() {
  console.log('App running on port: ' + PORT);
});
