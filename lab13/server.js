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

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var app = express();
var db;

var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
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

app.get('/api/comments', function(req, res) {
    db.collection("comments").find({}).toArray(function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(data);
    });
});

app.post('/api/comments', function(req, res) {
  var newComment = {
    id: Date.now(),
    author: req.body.author,
    text: req.body.text,
  };
  db.collection("comments").insertOne(newComment, function (err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    db.collection("comments").find({}).toArray(function (err, data) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      var comments = data;
      comments.push(newComment);
      res.json(comments);
    });
  });
});

app.get('/api/comments/:id', function(req, res) {
  db.collection("comments").find({"id": Number(req.params.id)}).toArray(function(err, docs) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(docs);
  });
});

app.put('/api/comments/:id', function(req, res) {
  let updatedCommentId = Number(req.params.id);
  let updatedComment = req.body;
  db.collection('comments').updateOne(
    { id: updatedCommentId },
    { $set: updatedComment },
    function(err, result) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      db.collection("comments").find({}).toArray(function (error, documents) {
        if (error) {
          console.error(error);
          process.exit(1);
        }
        res.json(documents);
      });
    }
  );
});

app.delete('/api/comments/:id', function(req, res) {
  db.collection("comments").deleteOne(
    {'id': Number(req.params.id)},
    function(err, result) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      db.collection("comments").find({}).toArray(function(error, documents) {
        if (error) {
          console.error(error);
          process.exit(1);
        }
        res.json(documents);
      });
    }
  );
});

MongoClient.connect('mongodb://cs336:' + process.env.MONGO_PASSWORD + '@ds155293.mlab.com:55293/cs336-ajf27', function (err, client) {
  if (err) throw err;

  db = client;
  app.listen(app.get('port'), function() {
      console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
});

app.use('*', express.static(APP_PATH));
