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
* Create a Person class in Javascript
*/
function Person(firstName, lastName, loginID, startDate) {
 this.firstName=firstName;
 this.lastName=lastName;
 this.loginID=loginID;
 this.startDate=startDate;
};
Person.prototype.setFirstName = function(newName) {
 this.firstName=newName;
};
Person.prototype.setLastName = function(newName) {
 this.lastName=newName;
};
Person.prototype.setID = function(newID) {
 this.loginID=newID;
}
Person.prototype.setStartDate = function(startDate) {
 this.startDate=startDate;
}
Person.prototype.getName = function() {
  let name = this.firstName + " " + this.lastName;
  return name;
}
Person.prototype.getFirstName = function() {
  return this.firstName;
}
Person.prototype.getLastName = function() {
  return this.lastName;
}
Person.prototype.getLogIn = function() {
  return this.loginID;
}
Person.prototype.getSeniority = function() {
  let todayDate = new Date();
  let startDate = new Date(this.startDate);
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
* Create some hard-coded people objects
*/
var Ruby = new Person("Ruby", "Rose", "redRoses","09/06/2016");
var Weiss = new Person("Weiss", "Schnee", "whiteMirror", "09/03/2014");
var Blake = new Person("Blake", "Belladonna", "blackShadows", "09/03/2014");
var Yang = new Person("Yang", "Xiao Long", "yellowFire", "09/03/2014");
var Qrow = new Person("Qrow", "Brawnwen", "badLuckCharm", "09/04/1979");
var Oscar = new Person("Oscar", "Pine", "ozcarpin", "09/06/2016");
var Grimm = new Person("Grimm", "", "rawr", "01/01/1900");
var Salem = new Person("Salem", "the Queen", "grimmMaster");

/**
* create an Array to hold the people of Remnant
*/
var people = [Ruby, Weiss, Blake, Yang, Qrow, Oscar, Grimm, Salem];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Handle get requests for nothing, person, person/id, person/id/name, person/id/years
 */
app.get('/', (req, res) => res.redirect('/getPerson.html'));
app.get('/getPerson.html', (req, res) => {res.redirect('/getPerson.html');});
app.get('/addPerson.html', (req, res) => {res.redirect('/addPerson.html');});

app.get("/fetchPerson", (req, res) =>
  {
    let found = false;
    for (i=0; i < people.length; i++) {
      //if the id exists in Remnant, send that person's record.
      //console.log(req.data);
      //console.log(req.data.value);
      if (req.params.value === people[i].getLogIn()) {
        let currentPerson = people[i];
        let person = new Object();
        person.loginID=currentPerson.getLogIn();
        person.Name=currentPerson.getName();
        person.years=currentPerson.getSeniority();
        if ( //DATA MUST BE COMPLETE BEFORE SENDING
          person.loginID !="" && person.loginID !== null &&
          currentPerson.getFirstName() !="" && currentPerson.getFirstName() !== null &&
          currentPerson.getLastName() !="" && currentPerson.getLastName() !== null &&
          person.years != -1
        ){
          res.json(JSON.stringify(person));
          found=true;
          break;
        }
      }
    }
    if (found===false) {
      //else, the requested id does not exist
      res.status(404).json({"error": "The requested id does not exist."});
    }
  });
  //FIXME FIXME









app.get("/fetch", (req, res) => res.send({"content" : "Did we mention that " + req.query.name + " is free? It is!"}));

/**
 * sends a JSON of all Remnant people to the requester
 */
app.get('/people', (req, res) => {
  let peopleRecord = ""; //create a variable to hold json information
  for (i=0; i < people.length; i++) {
    let person = new Object();
    person.loginID=people[i].getLogIn();
    person.name=people[i].getName();
    person.years=people[i].getSeniority();
    peopleRecord += JSON.stringify(person);
  }
  res.json(peopleRecord);
});

/**
 * sends a JSON of someone's full record with the matching loginID, or else a 404 error.
 */
app.get('/people/:id', (req, res) => {
  let found = false;
  for (i=0; i < people.length; i++) {
    //if the id exists in Remnant, send that person's record.
    if (req.params.id === people[i].getLogIn()) {
      let currentPerson = people[i];
      let person = new Object();
      person.loginID=currentPerson.getLogIn();
      person.Name=currentPerson.getName();
      person.years=currentPerson.getSeniority();
      if ( //DATA MUST BE COMPLETE BEFORE SENDING
        person.loginID !="" && person.loginID !== null &&
        currentPerson.getFirstName() !="" && currentPerson.getFirstName() !== null &&
        currentPerson.getLastName() !="" && currentPerson.getLastName() !== null &&
        person.years != -1
      ){
        res.json(JSON.stringify(person));
        found=true;
        break;
      }
    }
  }
  if (found===false) {
    //else, the requested id does not exist
    res.sendStatus(404);
  }
});

/**
  * sends a JSON of someone's full name, or else a 404 error.
  */
app.get('/people/:id/name', (req, res) => {
  let found = false;
  for (i=0; i < people.length; i++) {
    //if the id exists in Remnant, send that person's record.
    if (req.params.id === people[i].getLogIn()) {
      let person = new Object();
      let currentPerson = people[i];
      person.name=people[i].getName();
      if ( //DATA MUST BE COMPLETE BEFORE SENDING
        person.loginID !="" && person.loginID !== null &&
        currentPerson.getFirstName() !="" && currentPerson.getFirstName() !== null &&
        currentPerson.getLastName() !="" && currentPerson.getLastName() !== null &&
        person.years != -1
      ){
        res.json(JSON.stringify(person));
        found=true;
        break;
      }
    }
  }
  if (found===false) {
    //else, the requested id does not exist
    res.sendStatus(404);
  }
});

/**
  * sends a JSON of someone's seniority, or else a 404 error.
  */
app.get('/people/:id/years', (req, res) => {
  let found = false;
  for (i=0; i < people.length; i++) {
    //if the id exists in Remnant, send that person's record.
    if (req.params.id === people[i].getLogIn()) {
      let person = new Object();
      person.years=people[i].getSeniority();
      if ( //DATA MUST BE COMPLETE BEFORE SENDING
        person.loginID !="" && person.loginID !=null &&
        currentPerson.getFirstName() !="" && currentPerson.getFirstName() !== null &&
        currentPerson.getLastName() !="" && currentPerson.getLastName() !== null &&
        person.years != -1
      ){
        res.json(JSON.stringify(person));
        found=true;
        break;
      }
    }
  }
  if (found===false && i === people.length-1) {
    //else, the requested id does not exist
    res.sendStatus(404);
  }
});

//error message for get (for any URLs not specified above))
app.get('*', (req, res) => res.send(HttpStatus.getStatusText(HttpStatus.NOT_FOUND) + "\nYour file was not found at the given URL.\n"))


app.listen(port, () => console.log("Example app listening on port " + port + "!"));
