/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var app = express();
var db;

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

/**
 * Handle get requests for nothing, people, person/id, person/id/name, person/id/years
 */
//don't redirect requests to the root directory; the UI runs on the root directory
app.get('/', (req, res) => {});
app.get('', (req, res) => {res.redirect('/');});

app.get('/people', function(req, res) {
    db.collection("RemnantCitizens").find().toArray(function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(data);
    });
});

/******
app.get('/person/:id', (req, res) => {
  let currentPerson;
  //TODO: search the RemnantCitizens for the person's id and send that json.
  let currentPerson = people[req.params.id];
  if ( //DATA MUST BE COMPLETE BEFORE SENDING
    currentPerson.firstName !="" && currentPerson.firstName !== null &&
    currentPerson.lastName !="" && currentPerson.lastName !== null &&
    getSeniority(currentPerson.startDate) != -1
  ){
    res.json(currentPerson);
  }
  else {
    //else, data is incomplete
    res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  }
});

/**
  * sends a JSON of someone's full name, or else a 404 error.
  */
/*******************
app.get('/person/:id/name', (req, res) => {
  let currentPerson = people[req.params.id];
  if ( //DATA MUST BE COMPLETE BEFORE SENDING
    currentPerson.firstName !="" && currentPerson.firstName !== null &&
    currentPerson.lastName !="" && currentPerson.lastName !== null &&
    getSeniority(currentPerson.startDate) != -1
  ){
    res.json({name : (currentPerson.firstName + " " + currentPerson.lastName)});
  }
  else {
    //else, data is incomplete
    res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  }
});

/**
  * sends a JSON of someone's seniority, or else a 404 error.
  */
  /*******************
app.get('/person/:id/years', (req, res) => {
  let currentPerson = people[req.params.id];
  if ( //DATA MUST BE COMPLETE BEFORE SENDING
    currentPerson.firstName !="" && currentPerson.firstName !== null &&
    currentPerson.lastName !="" && currentPerson.lastName !== null &&
    getSeniority(currentPerson.startDate) != -1
  ){
    res.json({years: getSeniority(currentPerson.startDate)});
  }
  else {
    //else, data is incomplete
    res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  }
});

//error message for get (for any URLs not specified above))
app.get('*', (req, res) => res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND) + "\nYour file was not found at the given URL.\n"))


/**BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH

app.post('/api/comments', function(req, res) {
  db.collection("comments").find().toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = data;
    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);
    db.collection("comments").insertOne(newComment, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

****************/
MongoClient.connect('mongodb://cs336:' + process.env.MONGO_PASSWORD + '@ds155293.mlab.com:55293/cs336-ajf27', function (err, client) {
  if (err) throw err;

  db = client;
  app.listen(app.get('port'), function() {
      console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
});
