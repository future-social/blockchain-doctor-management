// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'front' directory
app.use(express.static(path.join(__dirname, '..', 'front')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
