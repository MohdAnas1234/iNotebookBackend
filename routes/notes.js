const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route-1: Get all notes using: GET "/api/auth/getUser".  (login required)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error("Error details:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route-2: Add new note using: GET "/api/notes/". (login required)
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error("Error details:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route-3: update n existing note using: put "/api/notes/updatenote". (login required)

router.put('/updatenote/:id', fetchuser, [
    ], async (req, res) => {
const {title,description,tag} = req.body;

try {
    
//new note object
const newNote = {};
if (title){newNote.title = title};
if (description){newNote.description = description};
if (tag){newNote.tag = tag};


//find the note to be updated and update it
let note = await Note.findById(req.params.id);
if(!note){res.status(404).send("Not Found")}

if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not allow");
}

note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})

res.json({note});
}catch (error) {
        console.error("Error details:", error);
        return res.status(500).send("Internal Server Error");
    }

})


// Route-4: delete n existing note using: Delete "/api/notes/updatenote". (login required)

router.delete('/deletenote/:id', fetchuser, [
  ], async (req, res) => {

try {
    
    

//find the note to be deleted and deteted its
let note = await Note.findById(req.params.id);
if(!note){res.status(404).send("Not Found")}

//allow deleteion only if user owns this note
if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not allow");
}

note = await Note.findByIdAndDelete(req.params.id)

res.json({"Success":"Note has been deleted",note:note});

}catch (error) {
        console.error("Error details:", error);
        return res.status(500).send("Internal Server Error");
    }
})
module.exports = router;

