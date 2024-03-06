const registerDoctor = require('./registerDoctor');
const doctorController = require('./doctorController');

// Route to create a new doctor
const doctorData = {
    doctor_id: "DOC01",
    first_name: "test",
    last_name: "test",
    gender: "male",
    specialisation: "test"
};
doctorController.createDoctor(doctorData);
registerDoctor.registerDoctorUser(doctorData['doctor_id']); 

