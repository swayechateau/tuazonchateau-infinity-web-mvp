const fs = require('fs');

// Define the path to your JSON file
const jsonFilePath = 'data.json';

module.exports = {
    getChats: JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')),
    saveMessage: save
}

function save(data) {
    // Read the current JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Extract the new message from the request body
    const newMessage = data;

    // Add the new message to the messages array
    jsonData.messages.push(newMessage);

    // Write the updated JSON data back to the file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
}