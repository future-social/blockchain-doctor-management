// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

// Route to retrieve doctor data
app.get('/retrieveDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        console.log(doctorId);
        // const result = await doctorController.retrieveDoctor(doctorId);
        const result = {
            doctor_id: doctorId,
            first_name: "test",
            last_name: "test",
            gender: "male",
            specialisation: "test"
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
