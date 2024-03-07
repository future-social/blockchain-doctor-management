// server.js
const express = require('express');
const routes = require('./route');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use('/', routes);

// Serve static files from the 'front' directory
// app.use(express.static(path.join(__dirname, '..', 'front')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'Admin_DoctorPersonalInformation01.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
