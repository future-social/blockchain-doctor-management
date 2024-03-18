function logout() {
    console.log("Logout button clicked");
    try {
      localStorage.removeItem('user');
      window.location.href = "/LoginPage.html";
    } catch (error) {
      alert("Logout unsuccessful" + error);
    }
  };

  function authentication(){
    console.log("TEST");
  if(!localStorage.getItem('user')){
    alert("Please login");
    window.location.href = "LoginPage.html";
  }
}

function append(){
    const user = localStorage.getItem('user');
    const appointmentLink = document.getElementById('appointment');
    const appUrl = `Doctor_Appointment01.html?doctorId=${user}`;

    const infoLink = document.getElementById('info');
    const infoUrl = `Doctor_PersonalInformation01.html?doctorId=${user}`;

    appointmentLink.href = appUrl;
    infoLink.href = infoUrl;
}

