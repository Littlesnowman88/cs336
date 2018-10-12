const express = require('express')
const HttpStatus = require('http-status-codes')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//implement a basic GET function
app.get('/', (req, res) => res.send("This is lab06 for CS336. Please go to /request or /forms."))

//implement important HTTP functions for /request
app.get('/request', (req, res) => res.send("The client asked to GET a webpage.\n"))
app.post('/request', (req, res) => res.send('The server is POSTing a resource under the url.\n'))
app.head('/request', (req, res) => res.send('The server is returning a resource HEADer.\n'))
app.put('/request', (req, res) => res.send('The server just PUT data under the url.\n'))
app.delete('/request', (req, res) => res.send('The server has DELETEd data at the url.\n'))

//From kvlinden: Responds to form posts from the forms/index.html example.
app.post('/my-handling-form-page', (req, res) => res.send('Hello, form POST!<br>Posted message: <code>'
   + req.body.user_message + '</code>'))

//error message for get (for all URLs other than '/' and '/request')
app.get('*', (req, res) => res.send(HttpStatus.getStatusText(HttpStatus.NOT_FOUND) + "\nYour file was not found at the given URL.\n"))

app.listen(port, () => console.log("Example app listening on port " + port + "!"))
