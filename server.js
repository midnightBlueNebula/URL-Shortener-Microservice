'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

var dns = require('dns');

var validUrl = require('valid-url');

var urlExists = require('url-exists');


// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var counter = 1;
var addedUrls = ['https://www.freecodecamp.org/forum/'];
var urlPairs = {1:'https://www.freecodecamp.org/forum/'};

app.post('/api/shorturl/new',function(req,res){
  if(addedUrls.indexOf(req.body.url)==-1){
    urlExists(req.body.url, function(err,exists){
      if(exists){
        ++counter;
        var url = req.body.url;
        addedUrls.push(req.body.url);
        urlPairs[counter]=url;
        res.send({"orginal_url":url,"short_url":counter});
      }
      
      else{
        res.send({"error":"invalid URL"});
      }
    });
  }
  else{
    res.send({"orginal_url":urlPairs[addedUrls.indexOf(req.body.url)+1],"short_url":addedUrls.indexOf(req.body.url)+1})
  }
});

app.get('/api/shorturl/:new',function(req,res){
  res.redirect(urlPairs[req.params.new]);
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});
