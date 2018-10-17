const express = require('express')
const HttpStatus = require('http-status-codes')
const app = express()
const PORT = 3000
const HOST="localhost";
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//redirect the user to the lab's correct html file.
app.get('/', (req, res) => res.redirect('/lab07.html'));
app.get("/lab07_1.html", (req, res) => {
  res.redirect('/lab07_1.html');
  res.send("Welcome to the lab07 Exercise 7.1.")
});
app.get("/lab07.html", (req, res) => res.redirect('/lab07.html'));
app.get("/hello", (req, res) => res.send(req.query));

app.get("/fetch", (req, res) => res.send({"content" : "Did we mention that " + req.query.name + " is free? It is!"}));

//error message for get (for any URLs not specified above))
app.get('*', (req, res) => res.send(HttpStatus.getStatusText(HttpStatus.NOT_FOUND) + "\nYour file was not found at the given URL.\n"))

app.listen(PORT, HOST, () => {
  console.log("Server is listening on " + HOST + ":" + PORT + "!")});
