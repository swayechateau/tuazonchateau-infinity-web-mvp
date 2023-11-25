const express = require('express');
const router = express.Router();
const {getChats, saveMessage} = require('./data');

// Define the path to your JSON file
const jsonFilePath = 'data.json';

// Middleware to parse JSON request body
router.use(express.json());

// GET route to retrieve the current JSON data
router.get('/', (req, res) => {
    try {
        // Read the JSON file
        const jsonData = getChats;
        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: 'Unable to read JSON file' });
    }
});

// POST route to add a new message to the JSON data
router.post('/', (req, res) => {
    try {
        saveMessage(req.body)
        res.json({ message: 'New message added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to update JSON file' });
    }
});

module.exports = router;
