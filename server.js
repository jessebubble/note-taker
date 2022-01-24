// Dependencies
const express = require('express'); // calls express
const fs = require('fs'); // calls file system
const path = require('path'); // node.js API - makes FS more predictable when working with Heroku

const { notes } = require('./db/db.json') // access to json

const app = express(); // Sets up express server - "instantiate the server"

const PORT = process.env.PORT || 3001; // environment variable for Heroku to run app

// middleware functions built into express.js
// takes incoming POST data and converts it to key/value pairings 
// extended true option informs server sub-array data may exist
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // takes incoming POST data in the form of json and parses it
app.use(express.static('public')); // gives access to front end code in public folder


app.get('/api/notes', (req, res) => { // route to display json data
    res.json(notes);
})

app.get('/', (req,res) => { // route to display content from index.html
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => { // route to display HTML content from note.html
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('*', (req, res) => { // wildcard route
    res.sendFile(path.join(__dirname, './public/index.html'));
})


function createNewNote(body, notesArray) { // function to accept POST route 
    const note = body;
    notesArray.push(note); // pushes note to path below on line 41
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'), // joins note with our db (database) directory  
        JSON.stringify({ notes: notesArray }, null, 2) // converts array data to JSON 
        // null means we don not want to edit any existing date
        // 2 is used to make data more readable  - creates white space
    );
    return note;
}



app.post('/api/notes', (req, res) => { // posting user inputed data to db (database) and in JSON format
    req.body.id = notes.length.toString(); // id setup based on length property (one number ahead of last index)
})


app.listen(PORT, () => { // // listens for any server request
    console.log(`API server now on port ${PORT}`); 
})

// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page

// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column

// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page

// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes

// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column

// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column