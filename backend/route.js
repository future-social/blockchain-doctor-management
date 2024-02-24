const express = require('express');
const router = express.Router();
const doctorController = require('./doctorController');

// Route to create a new doctor
router.post('/createDoctor', async (req, res) => {
    try {
        const doctorData = req.body;
        const result = await doctorController.createDoctor(doctorData);
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
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
