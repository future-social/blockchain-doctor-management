<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Personal Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        h1 {
            padding-left: 50px;
        }
        .big-container {
            width: 80%;
            margin: 0 auto 25px;
            border: 2px solid #d3d3d3;
            border-radius: 10px;
            padding: 20px;
        }
        .circle-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 20px;
            background-color: #ccc; /* Placeholder color */
        }

        .circle-image img {
            width: 120px;
            height: 120px;
        }

        .information-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .information-container label {
            font-weight: bold;
        }

        .information-container .row {
            display: flex;
            gap: 10px;
        }

        .information-container .column {
            flex: 1;
            padding: 5px;
        }

        .information-container input[type="text"],
        .information-container input[type="tel"],
        .information-container input[type="email"] {
            width: 95%;
            padding: 8px;
            border: none; /* Remove border */
            border-radius: 5px;
            background-color: #f0f0f0; /* Gray background color */
        }

        .information-container input[type="text"]:disabled,
        .information-container input[type="tel"]:disabled,
        .information-container input[type="email"]:disabled {
            background-color: #f0f0f0; /* Gray background color */
            cursor: not-allowed; /* Change cursor to not-allowed */
        }

        .information-container input[type="radio"] {
            margin: 5px;
        }

        .information-container button {
            padding: 10px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100px;
            margin: auto 10px;
        }

        .button-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .information-container button.edit {
            background-color: #CA1F7B;
            color: white;
        }

        .information-container button.edit:hover {
            background-color: #8E004A;
        }
    </style>
</head>
<body>
    <div id="headerContainer"></div>

    <h1>Doctor Personal Information</h1>
    <div class="big-container">
    <div class="information-container">
        <form id="informationForm">
        <div class="circle-image">
            <img src="image.png" alt="insert image">
        </div>
            <div class="row">
                <div class="column">
                    <label for="first_name">First Name:</label>
                    <input type="text" id="first_name" name="first_name" required disabled> 
                </div>
                <div class="column">
                    <label for="last_name">Last Name:</label>
                    <input type="text" id="last_name" name="last_name" required disabled> 
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <label for="ic_passport">IC No./ Passport Number:</label>
                    <input type="text" id="ic_passport" name="ic_passport" required disabled> 
                </div>
                <div class="column">
                    <label>Gender:</label>
                    <div>
                        <input type="radio" id="male" name="gender" value="male" required disabled> 
                        <label for="male">Male</label>
                        <input type="radio" id="female" name="gender" value="female" required disabled> 
                        <label for="female">Female</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <label for="staff_id">Staff ID:</label>
                    <input type="text" id="staff_id" name="staff_id" required disabled> 
                </div>
                <div class="column">
                    <label for="dob">DOB:</label>
                    <input type="text" id="dob" name="dob" required disabled> 
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <label for="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required disabled> 
                </div>
                <div class="column">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required disabled> 
                </div>
            </div>
            <div class="row">
                <div class="column">
                    <label for="address">Address:</label>
                    <input type="text" id="address" name="address" required disabled> 
                </div>
                <div class="column">
                    <label for="specialization">Specialization:</label>
                    <input type="text" id="specialization" name="specialization" required disabled>
                </div>
            </div>
            <h2>Emergency Contact</h2>
            <div class="row">
                <div class="column">
                    <label for="emergency_name">Name:</label>
                    <input type="text" id="emergency_name" name="emergency_name" required disabled> 
                </div>
                <div class="column">
                    <label for="emergency_mobile">Mobile Number:</label>
                    <input type="tel" id="emergency_mobile" name="emergency_mobile" required disabled> 
                </div>
                <div class="column">
                    <label for="relation">Relation:</label>
                    <input type="text" id="relation" name="relation" required disabled> 
                </div>
            </div>
            <div class="button-container">
                    <button type="button" class="edit">Edit</button>
            </div>
        </form>
    </div>
    </div>

    <div id="footerContainer"></div>

    <script>
            // Fetch and insert header
        fetch("adminheader.html")
          .then((response) => response.text())
          .then((html) => {
            document.getElementById("headerContainer").innerHTML = html;
          });

        fetch("Footer.html")
        .then((response) => response.text())
        .then((html) => {
          document.getElementById("footerContainer").innerHTML = html;
        });

        function displayDoctorInfo() {
            const doctorId = "123"; // Example doctor ID

            fetch(`/getDoctorInfo?doctorId=${doctorId}`)
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("first_name").textContent = data.first_name;
                    document.getElementById("last_name").textContent = data.last_name;
                    document.getElementById("ic_passport").textContent = data.ic_passport;
                    document.getElementById("male").textContent = data.male;
                    document.getElementById("female").textContent = data.female;
                    document.getElementById("staff_id").textContent = data.staff_id;
                    document.getElementById("dob").textContent = data.dob;
                    document.getElementById("mobile").textContent = data.mobile;
                    document.getElementById("email").textContent = data.email;
                    document.getElementById("address").textContent = data.address;
                    document.getElementById("specialization").textContent = data.specialization;、
                    document.getElementById("emergency_name").textContent = data.emergency_name;
                    document.getElementById("emergency_mobile").textContent = data.emergency_mobile;
                    document.getElementById("relation").textContent = data.relation;
                    
                })
                .catch((error) => {
                    console.error("Error fetching doctor information:", error);
                });
            }

            document.addEventListener("DOMContentLoaded", function() {
                displayDoctorInfo();
            });

            // Event listener for the edit button
            document.getElementById("editButton").addEventListener("click", function() {
                window.location.href = `editDoctor.html?doctorId=123`; // Example redirect URL
            });
        </script>

</body>
</html>
