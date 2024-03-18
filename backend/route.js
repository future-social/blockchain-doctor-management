// EDIT DMSAdminId and doctor ID to match
const express = require("express");
const router = express.Router();
const doctorController = require("./doctorController");
const registerDoctor = require("./registerDoctor");
const loggingController = require("./loggingController");
var DMSAdminId = " "; // TEST : TO BE PASSED FROM LOGIN
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

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

// Route to retrieve doctor count
router.get("/countDoctor", async (req, res) => {
  try {
    const count = await doctorController.countDoctor(DMSAdminId);
    res.json(count);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to create a new appointment
router.post("/createAppointment", async (req, res) => {
  try {
    const appointmentData = req.body;
    const result = await appointmentController.createAppointment(
      appointmentData,
      DMSAdminId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve appointment data
router.get("/retrieveAllAppointments", async (req, res) => {
  try {
    const result = await appointmentController.retrieveAllAppointments(
      DMSAdminId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to update appointment data
router.put("/updateAppointment/:appointmentId", async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const updatedData = req.body;
    const result = await appointmentController.updateAppointment(
      appointmentId,
      updatedData,
      DMSAdminId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to delete appointment data
router.delete("/deleteAppointment/:appointmentId", async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    await appointmentController.deleteAppointment(appointmentId, DMSAdminId);
    res.json({
      success: true,
      message: "Appointment data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve doctor availability
router.get("/retrieveDoctorAvailability/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const result = await appointmentController.getDoctorAvailability(doctorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve logs
router.get("/retrieveLogs", async (req, res) => {
  try {
    const logs = await loggingController.retrieveLogs(DMSAdminId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve patient name by id
router.get("/retrievePatientName/:patientId", async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const result = await appointmentController.retrievePatientName(
      patientId,
      doctorId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to retrieve logs
router.get("/retrieveLogs", async (req, res) => {
  try {
    const logs = await loggingController.retrieveLogs(DMSAdminId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// REG & LOGIN
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://meisuenn:password%40123@cluster0.krxkuxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a User model
const User = mongoose.model("users", {
  username: String,
  password: String,
});

// Handle registration
router.post("/register", async (req, res) => {
  try {
    if (!DMSAdminId.includes("DMSadmin")) {
      throw new Error(
        "You have no permission to register doctor! Please login as admin."
      );
    }
    const { username, password } = req.body;

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });

    // Log user information
    console.log("User attempting to register:", user);

    await user.save();

    // Log successful registration
    console.log("User registered successfully:", user);
  } catch (error) {
    // Log registration error
    console.error("Error during registration:", error);
    console.log(res.statusCode);
    res.status(500).send("Error: error");
  }
});

//Handle login with session
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Username." });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      //req.session.user = user;
      DMSAdminId = username;
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        username: username,
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during login.");
  }
});

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
      return res
        .status(200)
        .json({ success: false, message: "User or password not found." });
    }

    // Compare the provided current password with the stored password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect current password." });
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
