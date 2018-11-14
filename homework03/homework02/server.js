/**
 * server.js creates a set of people records and lets a client view them
 * Created by: Andrew Fulling (ajf27)
 * Date: 11/10/2018
 * For: CS336 Homework01 with Dr. Vander Linden
 */
const express = require('express')
const HttpStatus = require('http-status-codes')
const app = express()
const port = 3000
const HOST="localhost";
const bodyParser = require('body-parser');

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
  else {return -1;}
}

/**
* create a JSON-formatted people Object that holds people records
* thanks to Jordan Doorlag for the inspiration to simplify my person objects
*/
var people = {};
people["redRoses"] = {
  firstName : "Ruby",
  lastName : "Rose",
  startDate:"09/06/2016"
}
people["whiteMirror"] = {
  firstName : "Weiss",
  lastName : "Schnee",
  startDate : "09/03/2014"
}
people["blackShadows"] = {
  firstName : "Blake",
  lastName : "Belladonna",
  startDate : "09/03/2014"
}
people["yellowFire"] = {
  firstName : "Yang",
  lastName : "Xiao Long",
  startDate : "09/03/2014"
}
people["badLuckCharm"] = {
  firstName : "Qrow",
  lastName : "Brawnwen",
  startDate : "09/04/1979"
}
people["ozcarpin"] = {
  firstName : "Oscar",
  lastName : "Pine",
  startDate : "09/06/2016"
}
people["rawr"] = {
  firstName : "Grimm",
  lastName : "",
  startDate : "01/01/1900"
}
people["grimmMaster"] = {
  firstName : "Salem",
  lastName : "the Queen",
  startDate : ""
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Handle get requests for nothing, person, person/id, person/id/name, person/id/years
 */
app.get('/', (req, res) => res.redirect('/getPerson.html'));
app.get('/getPerson.html', (req, res) => {res.redirect('/getPerson.html');});
app.get('/addPerson.html', (req, res) => {res.redirect('/addPerson.html');});

/**
 * sends a JSON of all Remnant people to the requester
 */
app.get('/people', (req, res) => {
  res.json(people);
});

/**
 * sends a JSON of someone's full record with the matching loginID, or else a 404 error.
 */
app.get('/person/:id', (req, res) => {
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

/**
 * handle posts to /people
 * Precondition: all data fields must have something in them
 * Postcondition: IDs: if the id is new, a new person is created
 *                     else, the person is created with id + number of identical IDs
 *                     thus, IDs will always be unique in the database.
 *              The user will be shown the loginID, since the server can alter the user-input ID.
 */
app.post('/people', (req, res) => {
  let body = req.body;
  if ( //incoming data must be complete!!
    body.loginID!="" && body.loginID !== null &&
    body.firstName!="" && body.firstName !== null &&
    body.lastName!="" && body.lastName !== null &&
    getSeniority(body.startDate) != -1
  ){
    let newCitizen = {
      firstName: body.firstName,
      lastName: body.lastName,
      startDate: body.startDate
    };
    //if a new login ID, add to people
    let personid;
    if (!people[req.body.loginID]) {
      personid = "";
      people[req.body.loginID.toString()] = newCitizen;
    }
    else { //if already existing loginID, add a number to the end until a new loginID has been generated.
      personid = 1;
      while (people[req.body.loginID + personid.toString()]) {
        personid++;
      }
    //add the new remnant citizen!
      people[req.body.loginID.toString() + personid.toString()] = newCitizen;
    }
    //add the loginID to the display's json.
    res.json({loginID: (body.loginID.toString() + personid.toString()), firstName: newCitizen.firstName, lastName: newCitizen.lastName, startDate: newCitizen.startDate});
  } else {
    //the incoming form data was not complete
    res.sendStatus(HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY) + ": Not all of the required fields have been filled in.");
  }
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
       firstName: body.firstName,
       lastName: body.lastName,
       startDate: body.startDate
     };
     //if a new login ID, add to people
     if (!people[id]) { people[id] = newCitizen; }
     //else already existing loginID, modify the existing record
     else { people[id] = newCitizen; }
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
    if (people[id]) {
      delete people[id];
      res.sendStatus(HttpStatus.getStatusText(HttpStatus.OK));
    } else {res.sendStatus(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));}
  });


app.listen(port, () => console.log("Example app listening on port " + port + "!"));
