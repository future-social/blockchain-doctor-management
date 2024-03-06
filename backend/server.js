// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const registerDoctor = require('./registerDoctor');
const doctorController = require('./doctorController');

// Middleware
app.use(bodyParser.json());

// Route to create a new doctor
app.post('/createDoctor', async (req, res) => {
    try {
        const doctorData = req.body;
        const result = await doctorController.createDoctor(doctorData);
        registerDoctor.registerDoctorUser(doctorData['staff_id']); 
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve all doctor data
app.get('/retrieveAllDoctor', async (req, res) => {
    try {
        // const result = await doctorController.retrieveAllDoctor();
        const result = [{
            doctor_id: "DOC01",
            first_name: "first name",
            last_name: "last name",
            gender: "male",
            specialisation: "heart specialist"
        }, {
            doctor_id: "DOC02",
            first_name: "first name",
            last_name: "last name",
            gender: "male",
            specialisation: "lung specialist"
        },{
            doctor_id: "DOC03",
            first_name: "first name",
            last_name: "last name",
            gender: "female",
            specialisation: "skin specialist"
        }];
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve doctor data by id
app.get('/retrieveDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        // const result = await doctorController.retrieveDoctor(doctorId);
        const result = {
            doctor_id: doctorId,
            first_name: "first name",
            last_name: "last name",
            gender: "male",
            specialisation: "heart specialist"
        };
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to update doctor data
app.put('/updateDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const updatedData = req.body;
        const result = await doctorController.updateDoctor(doctorId, updatedData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to delete doctor data
app.delete('/deleteDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.appointmentId;
        await doctorController.deleteDoctor(doctorId);
        res.json({ success: true, message: 'Doctor data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Serve static files from the 'front' directory
app.use(express.static(path.join(__dirname, '..', 'front')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front','HTML', 'Admin_DoctorPersonalInformation01.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
