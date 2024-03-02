const express = require('express');
const router = express.Router();
const doctorController = require('./doctorController');

// Route to create a new doctor
router.post('/createDoctor', async (req, res) => {
    try {
        const doctorData = req.body;
        const result = await doctorController.createDoctor(doctorData);
        const activity = 'New doctor created: ${result}';
        await loggingController.logActivity(activity);        
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve doctor data
router.get('/retrieveDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const result = await doctorController.retrieveDoctor(doctorId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to update doctor data
router.put('/updateDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const updatedData = req.body;
        const result = await doctorController.updateDoctor(doctorId, updatedData);
        const activity = 'Doctor data updated for ID: ${doctorId}';
        await loggingController.logActivity(activity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to create a new appointment
router.post('/createAppointment', async (req, res) => {
    try {
        const appointmentData = req.body;
        const result = await appointmentController.createAppointment(appointmentData);
        const activity = 'New appointment created: ${result}';
        await loggingController.logActivity(activity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve appointment data
router.get('/retrieveAppointment/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const result = await appointmentController.retrieveAppointment(appointmentId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to update appointment data
router.put('/updateAppointment/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const updatedData = req.body;
        const result = await appointmentController.updateAppointment(appointmentId, updatedData);
        const activity = 'Appointment updated for ID: ${appointmentId}';
        await loggingController.logActivity(activity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to delete appointment data
router.delete('/deleteAppointment/:appointmentId', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        await appointmentController.deleteAppointment(appointmentId);
        const activity = 'Appointment deleted for ID: ${appointmentId}';
        await loggingController.logActivity(activity);
        res.json({ success: true, message: 'Appointment data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve logs
router.get('/retrieveLogs', async (req, res) => {
    try {
        const logs = await loggingController.retrieveLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
