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

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
const HttpStatus = require('http-status-codes')
var db;
var collection;

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
 * return the number of years between startingDate and today
 * takes individual months into account.
 * Params: startingDate: the date a person started with the organization
 * Returns: seniority, the number of years; else, -1 because startingDate is after today.
 */
getSeniority = function(startingDate) {
  let todayDate = new Date();
  let startDate = new Date(startingDate);
  var seniority = todayDate.getFullYear() - startDate.getFullYear();
  let month_difference = todayDate.getMonth() - startDate.getMonth();
  // if today is before the person's employment anniversary (excluding the year)
  if (month_difference < 0 || (month_difference === 0 && todayDate.getDate() < startDate.getDate())) {
   seniority--;
  }
  if (seniority >= 0) {return seniority;}
  else {return "???"}
}

/**
 * Handle get requests for nothing, people, person/id, person/id/name, person/id/years
 */
//don't redirect requests to the root directory; the UI runs on the root directory
app.get('/', (req, res) => {});
app.get('', (req, res) => {res.redirect('/');});
app.get('/people', function(req, res) {
    collection.find().toArray(function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(data);
    });
});


app.get('/person/:id', (req, res) => {
  //search the RemnantCitizens for the person's id and send that json.
  collection.find( {"loginID" : req.params.id } ).toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    };
    //because toArray gives the JSON object inside an array, subscript.
    let currentPerson = data[0];
    if ( //DATA MUST BE COMPLETE BEFORE SENDING
      currentPerson.firstName !="" && currentPerson.firstName !== null &&
      currentPerson.lastName !="" && currentPerson.lastName !== null &&
      getSeniority(currentPerson.startDate) != "???"
    ){
      res.json(currentPerson);
    }
    else {
      //else, data is incomplete
      res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
    }
  });
});

/**
  * sends a JSON of someone's full name, or else a 404 error.
  */
app.get('/person/:id/name', (req, res) => {
  //search the RemnantCitizens for the person's id and send that person's name as a json.
  collection.find( {"loginID" : req.params.id } ).toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    };
    //because toArray gives the JSON object inside an array, subscript.
    let currentPerson = data[0];
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
});

/**
  * sends a JSON of someone's seniority, or else a 404 error.
  */
app.get('/person/:id/years', (req, res) => {
  //search the RemnantCitizens for the person's id and send that person's name as a json.
  collection.find( {"loginID" : req.params.id } ).toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    };
    //because toArray gives the JSON object inside an array, subscript.
    let currentPerson = data[0];
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
});

/**
 * handle posts to /people
 * Precondition: all data fields must have something in them
 * Postcondition: IDs: if the id is new, a new person is created
 *                     else, the person is created with id + number of identical IDs
 *                     thus, IDs will always be unique in the database.
 *              The user will be shown the loginID, since the server can alter the user-input ID.
 */
app.post('/people', function(req, res) {
  let idSuffix = 0;
  let uniqueSuffixDetermined = false;
  var newPerson;
  var allPeople;
  //first, search for people who have the same loginID. If identical loginIDs exist, generate a unique ID.
  collection.find( {loginID : req.body.loginID }).toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      //no existing record of loginID was found.
      if (data.length == 0 || data[0].loginID != req.body.loginID) {
        newPerson = {
          loginID: req.body.loginID,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          startDate: req.body.startDate
        };
        //now that a new person, newPerson, has been created, it's time to post!
        //first, get the list of all people so newPerson can be appended.
        collection.find().toArray(function (err, data) {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          //sent to the browser so UI can be updated.
          allPeople = data;
          allPeople.push(newPerson);

          //now, update the database.
          collection.insertOne(newPerson, function (error) {
            if (error) {
              console.error(error);
              process.exit(1);
            }
            //send the list of people to the browser for updating.
            res.json(allPeople);
          });
        });
      }
      else {
        //an existing record was found, so create a uniqe loginID through recursion (because of asynchronous database calls)
        generateID = function(suffix) {
          //see if loginID + idSuffix exists. stop only when loginID + idSuffix does not already exist
          collection.find( {"loginID" : req.body.loginID+suffix}).toArray(function (error, nextData) {
            if (error) {
              console.error(error);
              process.exit(1);
            }
            else {
              //if the new person's loginID is now unique, stop recursion.
              if (nextData.length == 0 || nextData[0].loginID != req.body.loginID+suffix) {
                uniqueSuffixDetermined = true;
                newPerson = {
                  loginID: req.body.loginID+suffix,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  startDate: req.body.startDate
                };
                //now that a new person, newPerson, has been created, it's time to post!
                //first, get the list of all people so newPerson can be appended.
                collection.find().toArray(function (err, data) {
                  if (err) {
                    console.error(err);
                    process.exit(1);
                  }
                  //sent to the browser so UI can be updated.
                  allPeople = data;
                  allPeople.push(newPerson);

                  //now, update the database.
                  collection.insertOne(newPerson, function (error) {
                    if (error) {
                      console.error(error);
                      process.exit(1);
                    }
                    //send the list of people to the browser for updating.
                    res.json(allPeople);
                  });
                });
              }
              //otherwise, more recursion is needed to generate uniqueID
              else {
                generateID(suffix+1);
              }
            }
          });
        }
        generateID(idSuffix+1);
      }
    }
  });
});

/**
 * handles put to /person/:id
 * Result: status 201 if new resource created or existing resource modified,
 *         status 422 if missing or incomplete data given
 */

 app.put("/person/:id", (req, res) => {
   let id = req.params.id;
   let body = req.body;
   if ( //incoming data must be complete!!
     id !="" && id !== null &&
     body.firstName!="" && body.firstName !== null &&
     body.lastName!="" && body.lastName !== null &&
     getSeniority(body.startDate) != -1
   ){
     let newCitizen = {
       loginID: id,
       firstName: body.firstName,
       lastName: body.lastName,
       startDate: body.startDate
     };
     //put the data into the database.
     collection.updateOne(
       {"loginID": id}, newCitizen, {upsert: true}
     );
     //confirm that the record was either created or modified.
     res.sendStatus(HttpStatus.getStatusText(HttpStatus.CREATED));
   } else {
     //the incoming data was not complete
     res.sendStatus(HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY) + ": Not all of the required fields have been filled in.");
   }
 });

 /**
  * handles delete to /person/:id
  * Result: status 200 if resource is deleted,
  *         status 404 if citizen does not exist
  */
app.delete("/person/:id", (req, res) => {
  let id = req.params.id;
  collection.find({"loginID" : id}).toArray(function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    //if the id exists, delete the record and respond with OK
    if (data.length > 0) {
      collection.deleteOne({"loginID": id});
      res.sendStatus(HttpStatus.getStatusText(HttpStatus.OK));
    }
    //if the id does not exist, repond with not found.
    else {res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));}
  });
});

MongoClient.connect('mongodb://cs336:' + process.env.MONGO_PASSWORD + '@ds155293.mlab.com:55293/cs336-ajf27', function (err, client) {
  if (err) throw err;

  db = client;
  collection = db.collection("RemnantCitizens");
  app.listen(app.get('port'), function() {
      console.log('Server started: http://localhost:' + app.get('port') + '/');
  });
});

//error message for get (for any URLs not specified above))
//app.get('*', (req, res) => res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND) + "\nYour file was not found at the given URL.\n"))
