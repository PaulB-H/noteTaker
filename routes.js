const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded());

// GET `/notes` - Should return the `notes.html` file.
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});

// GET `*` - Should return the `index.html` file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', function (req, res) {
    req = fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        };
        res.send(jsonString)
    })
});

//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post('/api/notes', function (req, res) {
    console.log(req.body) 
    let oldNote = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    oldNote.push(req.body)

    for (i = 0; i < oldNote.length; i++){
        oldNote[i].id = i
    }

    fs.writeFileSync('./db/db.json', JSON.stringify(oldNote), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        return
    });
    res.send(req.body);
    
});

//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete('/api/notes/:id', function (req, res) {

    let deleteNote = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    for (var i = 0; i < deleteNote.length; i++) {
        if (deleteNote[i].id == req.params.id) {
            deleteNote.splice(i,1);
        }
    }

    for (i = 0; i < deleteNote.length; i++){
        deleteNote[i].id = i
    }    

    fs.writeFileSync('./db/db.json', JSON.stringify(deleteNote), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        return
    });
    res.send(req.body);

})

app.listen(3000);