const express = require("express");
const router = express.Router();
const doctorController = require("./doctorController");
const registerDoctor = require("./registerDoctor");
var DMSAdminId = "DMSadmin10"; // TEST : TO BE PASSED FROM LOGIN
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//const session = require('express-session');


//const app = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
/*
router.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));*/

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
  /*
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
  } */
});

// Route to retrieve doctor data by id
router.get("/retrieveDoctor/:doctorId", async (req, res) => {
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
  } catch (error) {
    // Log registration error
    console.error('Error during registration:', error);
    console.log(res.statusCode);
    res.status(500).send('Error during registration.');
  }
});

/*
//Handle login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      let redirectUrl;
      if (username.includes("adm")) {
        req.loggedInUser = username; // Set loggedInUser here
        redirectUrl = '/Admin_DoctorPersonalInformation01.html?id=' + username;
      } else if (username.includes("doc")) {
        req.loggedInUser = username; // Set loggedInUser here
        redirectUrl = '/Doctor_PersonalInformation02.html?id=' + username;
      } else {
        return res.status(401).send('Invalid credentials.');
      }
      
      res.json({ redirectUrl }); // Send the redirect URL as JSON response
    } else {
      res.status(401).send('Invalid credentials.'); // Authentication failed
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login.');
  }
}); */

//Handle login with session
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user){
      return res.status(200).json({ success: false, message: "Invalid Username."});
    }
    if (user && await bcrypt.compare(password, user.password)) {
      //req.session.user = user;
      DMSAdminId = username;
      return res.status(200).json({ success: true, message: "Login successful.", username: username});
    } else {
      return res.status(200).json({ success: false, message: "Invalid Password."});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login.');
  }
});
/*
router.get("/requireAuth", async (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});*/
/*
const requireAuth = (req, res, next) => {
  console.log(req.session.user);
  if (req.session.user) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.redirect('/LoginPage.html'); // User is not authenticated, redirect to login page
  }
} */
/*
// Handle logout
router.post('/logout', (req, res) => {
  console.log("Logout route invoked");
  req.session.destroy((err) => {
      if (err) {
          console.error("Error destroying session:", err);
          res.status(500).send('Error during logout.');
      } else {
          res.redirect('/LoginPage.html');
          console.log("Session end");
      }
  });
});*/


// Handle change password
router.post("/changePassword", async (req, res) => {
  try {
    // Retrieve currentPassword and newPassword from the request body
    const { currentPassword, newPassword } = req.body;
    console.log("Received Form Data:", req.body);
    
    // Fetch the user from the database based on the logged-in user's ID
    const user = await User.findOne({ username: DMSAdminId });

    // Verify if the provided current password matches the stored password
    if (!user || !user.password) {
      return res.status(200).json({ success: false, message: "User or password not found." });
    }

    // Compare the provided current password with the stored password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(200).json({ success: false, message: "Incorrect current password." });
    }

    // Hash the new password before saving it to the database
    const hashedNewPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPass;
    await user.save();

    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;