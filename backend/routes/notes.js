import express from 'express';
import fetchuser from "../middleware/fetchuser.js";
import Notes from "../models/Notes.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// ROUTE:1  Get All Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes',fetchuser,async (req, res) => {
    try {
        const notes = await Notes.find({user: req.user.id})
        res.json(notes);
    } 
    // Catch Error
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

// ROUTE:2  Add Notes using: POST "/api/notes/addnotes". Login required
router.post('/addnotes',fetchuser,[
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 char").isLength({ min: 5 }),
    ],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {title, description, tag} = req.body;
    try {
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        })

    const savedNotes = await note.save();
        res.json(savedNotes);
    } 
    // Catch Error
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

// ROUTE:3  Update exisiting notes using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id',fetchuser,async (req, res) => {
    const {title, description, tag} = req.body;

    // Create New Notes Object
    const newNote = {}

    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note = await Notes.findById(req.params.id);

    // id is invalid
    if(!note){return res.status(404).send("Not Found");} 

    // logged in but id isn't matched
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    } 

    // All good to go
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({note});
    });

    
// ROUTE:4  Delete exisiting notes using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id',fetchuser,async (req, res) => {

    let note = await Notes.findById(req.params.id);

    // id is invalid
    if(!note){return res.status(404).send("Not Found");} 

    // logged in but id isn't matched
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    } 

    // All good to go
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success": "Your Note has been deleted" ,note: note});
    });

export default router;