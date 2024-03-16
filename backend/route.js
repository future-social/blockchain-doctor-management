const express = require("express");
const router = express.Router();
const doctorController = require("./doctorController");
// const appointmentController = require("./appointmentController");
// const loggingController = require("./loggingController");
const registerDoctor = require("./registerDoctor");
const DMSAdminId = "";
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// const app = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Route to create a new doctor
router.post("/createDoctor", async (req, res) => {
  try {
    const doctorData = req.body;
    const result = await doctorController.createDoctor(doctorData, DMSAdminId);
    registerDoctor.registerDoctorUser(doctorData["doctor_id"]);
    //res.json(result);
    res.json({ success: true, message: "Doctor data created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve all doctor data
router.get("/retrieveAllDoctor", async (req, res) => {
  try {
    const result = await doctorController.retrieveAllDoctor(DMSAdminId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve doctor data by id
router.get("/retrieveDoctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const result = await doctorController.retrieveDoctor(doctorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to update doctor data
router.put("/updateDoctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const updatedData = req.body;

    const result = await doctorController.updateDoctor(
      DMSAdminId,
      doctorId,
      updatedData
    );
    //res.json(result);
    res.json({ success: true, message: "Doctor data updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to delete doctor data
router.delete("/deleteDoctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    await doctorController.deleteDoctor(doctorId, DMSAdminId);
    res.json({ success: true, message: "Doctor data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// // Route to create a new appointment
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

// Route to retrieve doctor count
router.get('/countDoctor', async (req, res) => {
  try {
      const count = await doctorController.countDoctor(DMSAdminId);
      res.json(count);
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// REG & LOGIN
// Connect to MongoDB
mongoose.connect('mongodb+srv://meisuenn:password%40123@cluster0.krxkuxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a User model
const User = mongoose.model('users', {
  username: String,
  password: String,
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: hashedPassword });
    
    // Log user information
    console.log('User attempting to register:', user);

    await user.save();

    // Log successful registration
    console.log('User registered successfully:', user);

    //res.send('Registration successful!');
    res.redirect('/LoginPage.html');
  } catch (error) {
    // Log registration error
    console.error('Error during registration:', error);
    console.log(res.statusCode);
    res.status(500).send('Error during registration.');
  }
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    /*
    if (user && await bcrypt.compare(password, user.password)) {
      DMSAdminId = username; 
      res.redirect('/Doctor_PersonalInformation02.html');  */
    if (user && await bcrypt.compare(password, user.password)) {
      if (username.includes("adm")){
        DMSAdminId = username;
        res.redirect('/Admin_DoctorPersonalInformation01.html?id=' + username);
      }
      else if (username.includes("doc")){
        DMSAdminId = username;
        res.redirect('/Doctor_PersonalInformation02.html?id=' + username);     
      } 
      else{
      res.status(401).send('Invalid credentials.');
      }
    }
  } catch (error) {
    res.status(500).send('Error during login.');
  }
});

// Handle change password
router.post('/changepassword', async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmNewPassword } = req.body;
    console.log('Received data:', { username, oldPassword, newPassword, confirmNewPassword });

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).send('Invalid old password.');
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send('New password and confirm new password do not match.');
    }

    // Ensure newPassword and user.password are valid strings
    const isValidString = (str) => typeof str === 'string' && str.trim().length > 0;

    if (!isValidString(newPassword) || !isValidString(user.password)) {
      return res.status(500).send('Invalid data for password change.');
    }

    // Hash the new password before updating
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send a redirect response to the login page
    res.redirect('/login');
  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).send(`Error during password change: ${error.message}`);
  }
});

module.exports = router;