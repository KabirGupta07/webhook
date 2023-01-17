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
var xhub = require('express-x-hub');

const PORT  = process.env.PORT || 6000;
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN;
var received_updates = [];

app.get('/', function(req, res) {
  console.log("Hello");
  console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get(['/facebook', '/instagram','/whatsapp'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  console.log('Facebook request body:', req.body);

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.post('/whatsapp', function(req, res) {
  console.log('whatsapp request body:');
  console.log(req.body);
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
});

app.listen(PORT, ()=>{
  console.log(`Server started at ${process.env.PORT}`);
});
