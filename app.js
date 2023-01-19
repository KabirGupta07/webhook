/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
const axios = require("axios");
var xhub = require('express-x-hub');

const PORT  = process.env.PORT || 6000;
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN;
var received_updates = [];

app.get('/', function(req, res) {
  console.log("Hello");
  console.log(req.body);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get(['/facebook','/instagram','/whatsapp'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/whatsapp', function(req, res) {
  console.log('whatsapp request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);

  axios.post("http://3.110.149.13:4600/conversation/chat", {
    data: req.body
  });
  return res.sendStatus(200);

});

app.listen(PORT, ()=>{
  console.log(`Server started at ${process.env.PORT}`);
});
