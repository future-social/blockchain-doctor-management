const express = require('express');
const router = express.Router();
const doctorController = require('./doctorController');
const registerDoctor = require('./registerDoctor');
const DMSAdminId = "DMSadmin10"; // TEST : TO BE PASSED FROM LOGIN

// Route to create a new doctor
router.post('/createDoctor', async (req, res) => {
    try {
        const doctorData = req.body;
        const result = await doctorController.createDoctor(doctorData, DMSAdminId);
        registerDoctor.registerDoctorUser(doctorData['doctor_id']); 
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve all doctor data
router.get('/retrieveAllDoctor', async (req, res) => {
    try {
        const result = await doctorController.retrieveAllDoctor(DMSAdminId);
        // const result = [{
        //     doctor_id: "DOC01",
        //     first_name: "first name",
        //     last_name: "last name",
        //     gender: "male",
        //     specialisation: "heart specialist"
        // }, {
        //     doctor_id: "DOC02",
        //     first_name: "first name",
        //     last_name: "last name",
        //     gender: "male",
        //     specialisation: "lung specialist"
        // },{
        //     doctor_id: "DOC03",
        //     first_name: "first name",
        //     last_name: "last name",
        //     gender: "female",
        //     specialisation: "skin specialist"
        // }];
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to retrieve doctor data by id
router.get('/retrieveDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const result = await doctorController.retrieveDoctor(doctorId);
        // const result = {
        //     doctor_id: doctorId,
        //     first_name: "first name",
        //     last_name: "last name",
        //     gender: "male",
        //     specialisation: "heart specialist"
        // };
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to update doctor data
router.put('/updateDoctor/:doctorId', async (req, res) => {
    try {
        // const doctorId = req.params.doctorId;
        const updatedData = req.body;
        const result = await doctorController.updateDoctor(DMSAdminId, updatedData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to delete doctor data
router.delete('/deleteDoctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        await doctorController.deleteDoctor(doctorId, DMSAdminId);
        res.json({ success: true, message: 'Doctor data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to create a new appointment
// router.post('/createAppointment', async (req, res) => {
//     try {
//         const appointmentData = req.body;
//         const result = await appointmentController.createAppointment(appointmentData, DMSAdminId);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Route to retrieve appointment data
// router.get('/retrieveAppointment/:appointmentId', async (req, res) => {
//     try {
//         const appointmentId = req.params.appointmentId;
//         const result = await appointmentController.retrieveAppointment(appointmentId, DMSAdminId);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Route to update appointment data
// router.put('/updateAppointment/:appointmentId', async (req, res) => {
//     try {
//         const appointmentId = req.params.appointmentId;
//         const updatedData = req.body;
//         const result = await appointmentController.updateAppointment(appointmentId, updatedData, DMSAdminId);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Route to delete appointment data
// router.delete('/deleteAppointment/:appointmentId', async (req, res) => {
//     try {
//         const appointmentId = req.params.appointmentId;
//         await appointmentController.deleteAppointment(appointmentId, DMSAdminId);
//         res.json({ success: true, message: 'Appointment data deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Route to retrieve logs
// router.get('/retrieveLogs', async (req, res) => {
//     try {
//         const logs = await loggingController.retrieveLogs();
//         res.json(logs);
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

module.exports = router;